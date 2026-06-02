import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, CheckCircle, XCircle, Clock, Home as HomeIcon, ChevronDown, ChevronUp } from 'lucide-react'

export default function MerchantApply() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    contactPhone: '',
    isFoodMerchant: false,
    idCardImage: '',
    businessLicense: '',
    healthCertificate: '',
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.contactPerson || !formData.contactPhone) {
      alert('请填写完整信息')
      return
    }
    if (!formData.idCardImage || !formData.businessLicense) {
      alert('请上传身份证照片和营业执照')
      return
    }
    if (formData.isFoodMerchant && !formData.healthCertificate) {
      alert('食品商户请上传健康证')
      return
    }
    setStatus('pending')
    alert('提交成功，请等待审核')
  }

  const handleImageUpload = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target?.result as string
        setFormData({ ...formData, [field]: url })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
      case 'rejected':
        return <XCircle className="w-20 h-20 text-red-500 mx-auto" />
      default:
        return <Clock className="w-20 h-20 text-yellow-500 mx-auto" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return '已通过审核'
      case 'rejected':
        return '审核未通过'
      default:
        return '等待审核中'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'approved':
        return '恭喜！您的商户已获得市集参与资格，请下载电子凭证'
      case 'rejected':
        return '很遗憾，您的申请未通过审核，原因：提交材料不完整，请重新提交'
      default:
        return '您的申请已提交，请耐心等待工作人员审核'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            <h1 className="text-xl font-serif font-bold text-gray-800">商家申报</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-gray-700"
          >
            退出登录
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {status && (
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <div className="flex-1 flex justify-center">
                  <div className={`flex flex-col items-center ${status === 'pending' || status === 'approved' || status === 'rejected' ? 'text-gray-800' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${status === 'pending' || status === 'approved' || status === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
                    <span className="text-sm font-medium">已提交</span>
                  </div>
                </div>
                <div className={`flex-1 h-1 mx-2 ${status === 'pending' || status === 'approved' || status === 'rejected' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                <div className="flex-1 flex justify-center">
                  <div className={`flex flex-col items-center ${status === 'approved' || status === 'rejected' ? 'text-gray-800' : status === 'pending' ? 'text-blue-500' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${status === 'approved' || status === 'rejected' ? 'bg-green-500 text-white' : status === 'pending' ? 'bg-blue-200 text-blue-600' : 'bg-gray-200 text-gray-400'}`}>2</div>
                    <span className="text-sm font-medium">审核中</span>
                  </div>
                </div>
                <div className={`flex-1 h-1 mx-2 ${status === 'approved' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className="flex-1 flex justify-center">
                  <div className={`flex flex-col items-center ${status === 'approved' ? 'text-gray-800' : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${status === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>3</div>
                    <span className="text-sm font-medium">已完成</span>
                  </div>
                </div>
              </div>
            </div>

            {getStatusIcon()}
            <h3 className="text-2xl font-semibold mt-6 mb-3 text-gray-800 text-center">
              {getStatusText()}
            </h3>
            <p className="text-gray-600 mb-6 text-center">{getStatusDescription()}</p>

            {status === 'approved' && (
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-700 font-medium">
                  您已获得市集参与资格
                </p>
                <button className="bg-gray-800 text-white px-8 py-3 rounded hover:bg-gray-700 transition-colors">
                  下载电子凭证
                </button>
              </div>
            )}

            {status === 'rejected' && (
              <div className="space-y-4 text-center">
                <button
                  onClick={() => setStatus(null)}
                  className="border border-gray-800 text-gray-800 px-8 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors"
                >
                  重新填写
                </button>
              </div>
            )}

            {status === 'pending' && (
              <div className="text-center">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-600 px-8 py-3 rounded hover:bg-gray-100 transition-colors mx-auto"
                >
                  <span>查看申请详情</span>
                  {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {showDetails && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4">申请信息</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">商户名称</span>
                        <span className="font-medium text-gray-800">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">联系人</span>
                        <span className="font-medium text-gray-800">{formData.contactPerson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">联系电话</span>
                        <span className="font-medium text-gray-800">{formData.contactPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">食品商户</span>
                        <span className="font-medium text-gray-800">{formData.isFoodMerchant ? '是' : '否'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 1 && !status && (
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">
              商户基本信息
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  商户名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入商户名称"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                  style={{ color: '#1f2937' }}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  联系人 *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  placeholder="请输入联系人姓名"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                  style={{ color: '#1f2937' }}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  联系电话 *
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="请输入联系电话"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                  style={{ color: '#1f2937' }}
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFoodMerchant}
                    onChange={(e) =>
                      setFormData({ ...formData, isFoodMerchant: e.target.checked })
                    }
                    className="mr-3 w-5 h-5"
                  />
                  <span className="text-gray-800">我单位涉及食品销售/加工</span>
                </label>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 2 && !status && (
          <div className="bg-white rounded-xl shadow p-8">
            <h3 className="text-2xl font-semibold mb-8 text-gray-800">
              证照上传
            </h3>

            <div className="space-y-8">
              <div>
                <label className="block text-sm text-gray-700 mb-3 font-medium">
                  身份证照片 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('idCardImage', e)}
                    className="hidden"
                    id="id-card-upload"
                  />
                  <label htmlFor="id-card-upload" className="cursor-pointer">
                    {formData.idCardImage ? (
                      <div className="space-y-2">
                        <img
                          src={formData.idCardImage}
                          alt="身份证"
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600">点击更换图片</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 text-lg">点击上传身份证照片</p>
                        <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-3 font-medium">
                  营业执照 *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload('businessLicense', e)}
                    className="hidden"
                    id="license-upload"
                  />
                  <label htmlFor="license-upload" className="cursor-pointer">
                    {formData.businessLicense ? (
                      <div className="space-y-2">
                        <img
                          src={formData.businessLicense}
                          alt="营业执照"
                          className="max-h-40 mx-auto rounded-lg"
                        />
                        <p className="text-sm text-gray-600">点击更换图片</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600 text-lg">点击上传营业执照</p>
                        <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {formData.isFoodMerchant && (
                <div>
                  <label className="block text-sm text-gray-700 mb-3 font-medium">
                    健康证 *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload('healthCertificate', e)}
                      className="hidden"
                      id="health-upload"
                    />
                    <label htmlFor="health-upload" className="cursor-pointer">
                      {formData.healthCertificate ? (
                        <div className="space-y-2">
                          <img
                            src={formData.healthCertificate}
                            alt="健康证"
                            className="max-h-40 mx-auto rounded-lg"
                          />
                          <p className="text-sm text-gray-600">点击更换图片</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 text-lg">点击上传健康证</p>
                          <p className="text-sm text-gray-400 mt-2">支持 JPG、PNG 格式</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-800 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
                >
                  提交申请
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
