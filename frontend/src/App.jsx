import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'

function ResidentList() {
    const [name, setName] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [phone, setPhone] = useState('')
    const [residents, setResidents] = useState([])
    const [editingId, setEditingId] = useState(null)

    const fetchResidents = () => {
        fetch('http://localhost:8080/residents')
            .then((response) => response.json())
            .then((data) => {
                setResidents(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchResidents()
    }, [])

    const handleSubmit = async () => {
        if (!name || !roomNumber || !phone) {
            alert('氏名・部屋番号・電話番号をすべて入力してください')
            return
        }

        const resident = {
            name: name,
            roomNumber: roomNumber,
            phone: phone,
        }

        try {
            const response = await fetch('http://localhost:8080/residents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resident),
            })

            if (!response.ok) {
                throw new Error('登録に失敗しました')
            }

            alert('入居者を登録しました！')

            setName('')
            setRoomNumber('')
            setPhone('')

            fetchResidents()
        } catch (error) {
            console.error(error)
            alert('登録に失敗しました')
        }
    }

    const handleEdit = (resident) => {
        setEditingId(resident.id)
        setName(resident.name)
        setRoomNumber(resident.roomNumber)
        setPhone(resident.phone)
    }

    const handleUpdate = async () => {
        const resident = {
            name: name,
            roomNumber: roomNumber,
            phone: phone,
        }

        try {
            const response = await fetch(
                `http://localhost:8080/residents/${editingId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(resident),
                }
            )

            if (!response.ok) {
                throw new Error('更新に失敗しました')
            }

            alert('入居者情報を更新しました！')

            setEditingId(null)
            setName('')
            setRoomNumber('')
            setPhone('')

            fetchResidents()
        } catch (error) {
            console.error(error)
            alert('更新に失敗しました')
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setName('')
        setRoomNumber('')
        setPhone('')
    }

    const handleDelete = async (id) => {
        const result = window.confirm('この入居者を削除しますか？')

        if (!result) {
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/residents/${id}`,
                {
                    method: 'DELETE',
                }
            )

            if (!response.ok) {
                throw new Error('削除に失敗しました')
            }

            alert('入居者を削除しました！')

            fetchResidents()
        } catch (error) {
            console.error(error)
            alert('削除に失敗しました')
        }
    }

    return (
        <div>
            <h1>アパート管理システム</h1>
            <Link to="/admin/repair-requests">
                <button>修繕依頼一覧</button>
            </Link>

            <h2>入居者登録</h2>

            <div>
                <label>
                    氏名
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    部屋番号
                    <input
                        type="text"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    電話番号
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
            </div>

            {editingId === null ? (
                <button onClick={handleSubmit}>登録する</button>
            ) : (
                <>
                    <button onClick={handleUpdate}>更新する</button>
                    <button onClick={handleCancelEdit}>キャンセル</button>
                </>
            )}

            <h2>入居者一覧</h2>

            {residents.map((resident) => (
                <div key={resident.id}>
                    <p>氏名：{resident.name}</p>
                    <p>部屋番号：{resident.roomNumber}</p>
                    <p>電話番号：{resident.phone}</p>

                    <Link to={`/admin/residents/${resident.id}`}>
                        <button>詳細</button>
                    </Link>

                    <button onClick={() => handleEdit(resident)}>編集</button>
                    <button onClick={() => handleDelete(resident.id)}>削除</button>

                    <hr />
                </div>
            ))}
        </div>
    )
}
<Link to="/">
    <button>入居者一覧に戻る</button>
</Link>

function ResidentDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [resident, setResident] = useState(null)
    const [repairRequests, setRepairRequests] = useState([])

    useEffect(() => {
        // 入居者情報を取得
        fetch(`http://localhost:8080/residents/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setResident(data)
            })
            .catch((error) => {
                console.error(error)
            })

        // この入居者の修繕依頼を取得
        fetch(`http://localhost:8080/repair-requests/resident/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setRepairRequests(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [id])

    if (!resident) {
        return <p>読み込み中...</p>
    }

    return (
        <div>
            <h1>入居者詳細</h1>

            <p>氏名：{resident.name}</p>
            <p>部屋番号：{resident.roomNumber}</p>
            <p>電話番号：{resident.phone}</p>

            <h2>修繕依頼履歴</h2>

            {repairRequests.length === 0 ? (
                <p>修繕依頼はありません。</p>
            ) : (
                repairRequests.map((request) => (
                    <div key={request.id}>
                        <p>依頼ID：{request.id}</p>
                        <p>カテゴリ：{request.category}</p>
                        <p>内容：{request.description}</p>
                        <p>ステータス：{request.status}</p>

                        <Link to={`/repair-requests/${request.id}`}>
                            <button>修繕依頼の詳細</button>
                        </Link>

                        <hr />
                    </div>
                ))
            )}

            <button onClick={() => navigate('/')}>
                一覧に戻る
            </button>
        </div>
    )
}

function RepairRequestList() {
    const [residentId, setResidentId] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [repairRequests, setRepairRequests] = useState([])
    const [statusFilter, setStatusFilter] = useState('すべて')
    const [residents, setResidents] = useState([])

    const fetchRepairRequests = () => {
        fetch('http://localhost:8080/repair-requests')
            .then((response) => response.json())
            .then((data) => {
                setRepairRequests(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        fetchRepairRequests()

        fetch('http://localhost:8080/residents')
            .then((response) => response.json())
            .then((data) => {
                setResidents(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const getResidentName = (residentId) => {
        const resident = residents.find(
            (resident) => resident.id === residentId
        )

        if (!resident) {
            return `入居者ID：${residentId}`
        }

        return `${resident.roomNumber}号室　${resident.name}`
    }

    const handleSubmit = async () => {

        if (!residentId || !category || !description.trim()) {
            alert('入居者ID・カテゴリ・内容をすべて入力してください')
            return
        }

        const repairRequest = {
            residentId: Number(residentId),
            category: category,
            description: description,
            status: '未対応',
        }

        try {
            const response = await fetch(
                'http://localhost:8080/repair-requests',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(repairRequest),
                }
            )

            if (!response.ok) {
                throw new Error('登録に失敗しました')
            }

            alert('修繕依頼を登録しました！')

            setResidentId('')
            setCategory('')
            setDescription('')

            fetchRepairRequests()
        } catch (error) {
            console.error(error)
            alert('登録に失敗しました')
        }

    }

    const handleDelete = async (id) => {
        const result = window.confirm('この修繕依頼を削除しますか？')

        if (!result) {
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/repair-requests/${id}`,
                {
                    method: 'DELETE',
                }
            )

            if (!response.ok) {
                throw new Error('削除に失敗しました')
            }

            alert('修繕依頼を削除しました！')

            fetchRepairRequests()
        } catch (error) {
            console.error(error)
            alert('削除に失敗しました')
        }
    }

    return (
        <div>
            <h1>管理人:修繕依頼一覧</h1>

            <h2>修繕依頼登録</h2>

            <div>
                <label>
                    入居者
                    <select
                        value={residentId}
                        onChange={(e) => setResidentId(e.target.value)}
                    >
                        <option value="">入居者を選択してください</option>

                        {residents.map((resident) => (
                            <option key={resident.id} value={resident.id}>
                                {resident.roomNumber}号室　{resident.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label>
                    カテゴリ
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">カテゴリを選択してください</option>
                        <option value="水回り">水回り</option>
                        <option value="電気">電気</option>
                        <option value="建具・ドア">建具・ドア</option>
                        <option value="エアコン・空調">エアコン・空調</option>
                        <option value="その他">その他</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    内容
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>

            <button onClick={handleSubmit}>登録する</button>

            <h2>修繕依頼一覧</h2>

            <div>
                <label>
                    ステータスで絞り込み
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="すべて">すべて</option>
                        <option value="未対応">未対応</option>
                        <option value="対応中">対応中</option>
                        <option value="対応済み">対応済み</option>
                    </select>
                </label>
            </div>

            {repairRequests
                .filter(
                    (request) =>
                        statusFilter === 'すべて' ||
                        request.status === statusFilter
                )
                .map((request) => (

                <div key={request.id}>
                    <p>依頼ID：{request.id}</p>
                    <p>入居者：{getResidentName(request.residentId)}</p>
                    <p>カテゴリ：{request.category}</p>
                    <p>内容：{request.description}</p>
                    <p>ステータス：{request.status}</p>
                    <Link to={`/admin/repair-requests/${request.id}`}>
                        <button>詳細</button>
                    </Link>

                    <button onClick={() => handleDelete(request.id)}>
                        削除
                    </button>

                    <hr />
                </div>

            ))}
        </div>
    )
}

function ResidentRepairRequestList() {
    const residentId = Number(sessionStorage.getItem('residentId'))

    const [resident, setResident] = useState(null)
    const [repairRequests, setRepairRequests] = useState([])

    useEffect(() => {
        fetch(`http://localhost:8080/residents/${residentId}`)
            .then((response) => response.json())
            .then((data) => {
                setResident(data)
            })
            .catch((error) => {
                console.error(error)
            })

        fetch(`http://localhost:8080/repair-requests/resident/${residentId}`)
            .then((response) => response.json())
            .then((data) => {
                setRepairRequests(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return (
        <div>
            <h1>入居者：修繕依頼</h1>

            {resident && (
                <p>
                    {resident.roomNumber}号室　{resident.name}
                </p>
            )}

            <h2>自分の修繕依頼</h2>

            {repairRequests.length === 0 ? (
                <p>修繕依頼はありません。</p>
            ) : (
                repairRequests.map((request) => (
                    <div key={request.id}>
                        <p>カテゴリ：{request.category}</p>
                        <p>内容：{request.description}</p>
                        <p>ステータス：{request.status}</p>
                        <hr />
                    </div>
                ))
            )}

            <button onClick={() => window.location.href = `/residents/${residentId}`}>
                自分の情報を見る
            </button>

            <button
                onClick={() => {
                    sessionStorage.clear()
                    window.location.href = '/'
                }}
            >
                ログアウト
            </button>
        </div>
    )
}

function Login() {
    const navigate = useNavigate()

    const [residents, setResidents] = useState([])
    const [selectedResidentId, setSelectedResidentId] = useState('')

    useEffect(() => {
        fetch('http://localhost:8080/residents')
            .then((response) => response.json())
            .then((data) => {
                setResidents(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    const handleResidentLogin = () => {
        if (!selectedResidentId) {
            alert('入居者を選択してください')
            return
        }

        sessionStorage.setItem('userRole', 'resident')
        sessionStorage.setItem('residentId', selectedResidentId)

        navigate('/my-repair-requests')
    }

    const handleAdminLogin = () => {
        sessionStorage.setItem('userRole', 'admin')
        sessionStorage.removeItem('residentId')

        navigate('/admin')
    }

    return (
        <div>
            <h1>アパート管理システム</h1>

            <h2>利用者を選択してください</h2>

            <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
            >
                <option value="">入居者を選択してください</option>

                {residents.map((resident) => (
                    <option key={resident.id} value={resident.id}>
                        {resident.roomNumber}号室　{resident.name}
                    </option>
                ))}
            </select>

            <br />
            <br />

            <button onClick={handleResidentLogin}>
                入居者として利用
            </button>

            <br />
            <br />

            <button onClick={handleAdminLogin}>
                管理人として利用
            </button>
        </div>
    )
}

function AdminHome() {
    const navigate = useNavigate()

    return (
        <div>
            <h1>管理人画面</h1>

            <button onClick={() => navigate('/admin/residents')}>
                入居者一覧
            </button>

            <button onClick={() => navigate('/admin/repair-requests')}>
                修繕依頼管理
            </button>

            <button
                onClick={() => {
                    sessionStorage.clear()
                    navigate('/')
                }}
            >
                ログアウト
            </button>

        </div>
    )
}

function ProtectedRoute({ children, allowedRoles }) {
    const userRole = sessionStorage.getItem('userRole')

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace />
    }

    return children
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />

            <Route
                path="/my-repair-requests"
                element={
                    <ProtectedRoute allowedRoles={['resident']}>
                        <ResidentRepairRequestList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/residents/:id"
                element={
                    <ProtectedRoute allowedRoles={['resident', 'admin']}>
                        <ResidentDetail />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/residents/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ResidentDetail />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminHome />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/residents"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <ResidentList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/repair-requests"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <RepairRequestList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/repair-requests/:id"
                element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <RepairRequestDetail />
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}

function RepairRequestDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [repairRequest, setRepairRequest] = useState(null)
    const [status, setStatus] = useState('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [resident, setResident] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:8080/repair-requests/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setRepairRequest(data)
                setStatus(data.status)
                setCategory(data.category)
                setDescription(data.description)

                return fetch(
                    `http://localhost:8080/residents/${data.residentId}`
                )
            })
            .then((response) => response.json())
            .then((data) => {
                setResident(data)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [id])

    const handleUpdate = async () => {
        if (!category || !description.trim()) {
            alert('カテゴリと内容を入力してください')
            return
        }

        try {
            const response = await fetch(
                `http://localhost:8080/repair-requests/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        category: category,
                        description: description,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('更新に失敗しました')
            }

            const data = await response.json()

            setRepairRequest(data)

            alert('修繕依頼を更新しました！')
        } catch (error) {
            console.error(error)
            alert('修繕依頼の更新に失敗しました')
        }
    }

    const handleStatusUpdate = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/repair-requests/${id}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: status,
                    }),
                }
            )

            if (!response.ok) {
                throw new Error('ステータスの更新に失敗しました')
            }

            const data = await response.json()

            setRepairRequest(data)

            alert('ステータスを更新しました！')
        } catch (error) {
            console.error(error)
            alert('ステータスの更新に失敗しました')
        }
    }

    if (!repairRequest) {
        return <p>読み込み中...</p>
    }

    return (
        <div>
            <h1>修繕依頼詳細</h1>

            {resident && (
                <p>
                    入居者：{resident.roomNumber}号室　{resident.name}
                </p>
            )}

            <div>
                <label>
                    カテゴリ
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">カテゴリを選択してください</option>
                        <option value="水回り">水回り</option>
                        <option value="電気">電気</option>
                        <option value="建具・ドア">建具・ドア</option>
                        <option value="エアコン・空調">エアコン・空調</option>
                        <option value="その他">その他</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    内容
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>

            <button onClick={handleUpdate}>更新する</button>

            <p>現在のステータス：{repairRequest.status}</p>

            <div>
                <label>
                    ステータス変更
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="未対応">未対応</option>
                        <option value="対応中">対応中</option>
                        <option value="対応済み">対応済み</option>
                    </select>
                </label>
            </div>

            <button onClick={handleStatusUpdate}>変更する</button>

            <button onClick={() => navigate(`/residents/${repairRequest.residentId}`)}>
                入居者詳細に戻る
            </button>

            <button onClick={() => navigate('/repair-requests')}>
                修繕依頼一覧に戻る
            </button>

        </div>
    )
}

export default App