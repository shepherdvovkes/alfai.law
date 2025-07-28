'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { 
  User, Mail, Phone, Building, MapPin, Calendar, Shield, 
  Edit, Save, X, Upload, Download, Camera, Star, Award,
  Briefcase, GraduationCap, Globe, Linkedin, Twitter, 
  Facebook, Instagram, Github, ExternalLink, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import AvatarUpload from '@/components/profile/AvatarUpload'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

interface ProfileData {
  // Basic Information
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  
  // Professional Information
  title: string
  firm: string
  barNumber: string
  specialization: string[]
  experience: number
  education: string
  certifications: string[]
  
  // Personal Information
  dateOfBirth: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  
  // Social Links
  linkedin: string
  twitter: string
  website: string
  
  // Preferences
  language: string
  timezone: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  
  // Social Login Info
  socialAccounts: {
    google?: { email: string; connected: boolean }
    apple?: { email: string; connected: boolean }
    facebook?: { email: string; connected: boolean }
  }
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    title: '',
    firm: '',
    barNumber: '',
    specialization: [],
    experience: 0,
    education: '',
    certifications: [],
    dateOfBirth: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    linkedin: '',
    twitter: '',
    website: '',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    socialAccounts: {}
  })

  useEffect(() => {
    // Check for demo user first
    const demoUser = localStorage.getItem('demoUser')
    if (demoUser) {
      const userData = JSON.parse(demoUser)
      setProfileData(prev => ({
        ...prev,
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        email: userData.email || '',
        title: 'Associate Attorney',
        firm: 'Demo Law Firm',
        avatar: userData.avatar || ''
      }))
      return
    }

    if (session?.user) {
      // Load profile data from session and localStorage
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile))
      } else {
        // Initialize with session data
        setProfileData(prev => ({
          ...prev,
          firstName: session.user.name?.split(' ')[0] || '',
          lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
          email: session.user.email || '',
          title: session.user.position || '',
          firm: session.user.firm || ''
        }))
      }
    }
  }, [session])

  const handleInputChange = (field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (type: string, value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }))
  }

  const addSpecialization = (specialization: string) => {
    if (specialization.trim() && !profileData.specialization.includes(specialization.trim())) {
      setProfileData(prev => ({
        ...prev,
        specialization: [...prev.specialization, specialization.trim()]
      }))
    }
  }

  const removeSpecialization = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index)
    }))
  }

  const addCertification = (certification: string) => {
    if (certification.trim() && !profileData.certifications.includes(certification.trim())) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certification.trim()]
      }))
    }
  }

  const removeCertification = (index: number) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Check if it's a demo user
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        // Update demo user data
        const userData = JSON.parse(demoUser)
        const updatedDemoUser = {
          ...userData,
          name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          email: profileData.email
        }
        localStorage.setItem('demoUser', JSON.stringify(updatedDemoUser))
        localStorage.setItem('userProfile', JSON.stringify(profileData))
        toast.success('Demo profile updated successfully!')
        setIsEditing(false)
        return
      }
      
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem('userProfile', JSON.stringify(profileData))
      
      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: `${profileData.firstName} ${profileData.lastName}`.trim(),
          position: profileData.title,
          firm: profileData.firm
        }
      })
      
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const importFromSocial = async (provider: string) => {
    setIsLoading(true)
    try {
      // Simulate importing data from social provider
      const mockSocialData = {
        google: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          avatar: 'https://via.placeholder.com/150'
        },
        apple: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@icloud.com',
          avatar: 'https://via.placeholder.com/150'
        },
        facebook: {
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@facebook.com',
          avatar: 'https://via.placeholder.com/150'
        }
      }

      const data = mockSocialData[provider as keyof typeof mockSocialData]
      if (data) {
        setProfileData(prev => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          avatar: data.avatar,
          socialAccounts: {
            ...prev.socialAccounts,
            [provider]: { email: data.email, connected: true }
          }
        }))
        toast.success(`Data imported from ${provider}!`)
      }
    } catch (error) {
      toast.error(`Failed to import from ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'social', label: 'Social Links', icon: Globe },
    { id: 'preferences', label: 'Preferences', icon: Shield }
  ]

  if (!session) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-surface-dark p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Profile Settings</h1>
            <p className="text-text-secondary">Manage your account information and preferences</p>
          </div>
          <LanguageSwitcher variant="compact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-6">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <AvatarUpload
                  currentAvatar={profileData.avatar}
                  onAvatarChange={(avatar) => handleInputChange('avatar', avatar)}
                  disabled={!isEditing}
                />
                <h3 className="text-lg font-semibold text-text-primary mt-4">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-text-secondary text-sm">{profileData.title}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-light/50'
                      }`}
                    >
                      <Icon size={18} />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      loading={isLoading}
                      className="w-full"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      className="w-full"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'basic' && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-text-primary">Basic Information</h2>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => importFromSocial('google')}
                          disabled={isLoading}
                        >
                          <Upload size={14} className="mr-1" />
                          Import from Google
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => importFromSocial('apple')}
                          disabled={isLoading}
                        >
                          <Upload size={14} className="mr-1" />
                          Import from Apple
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        leftIcon={<User size={18} />}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Last Name"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        leftIcon={<User size={18} />}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        leftIcon={<Mail size={18} />}
                        disabled={!isEditing}
                        required
                      />
                      <Input
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        leftIcon={<Phone size={18} />}
                        disabled={!isEditing}
                      />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'professional' && (
                  <motion.div
                    key="professional"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-text-primary">Professional Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Job Title"
                        value={profileData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        leftIcon={<Briefcase size={18} />}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Law Firm"
                        value={profileData.firm}
                        onChange={(e) => handleInputChange('firm', e.target.value)}
                        leftIcon={<Building size={18} />}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Bar Number"
                        value={profileData.barNumber}
                        onChange={(e) => handleInputChange('barNumber', e.target.value)}
                        leftIcon={<Shield size={18} />}
                        disabled={!isEditing}
                      />
                      <Input
                        label="Years of Experience"
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                        leftIcon={<Award size={18} />}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Specializations
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add specialization"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addSpecialization(e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.querySelector('input[placeholder="Add specialization"]') as HTMLInputElement
                                if (input) {
                                  addSpecialization(input.value)
                                  input.value = ''
                                }
                              }}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profileData.specialization.map((spec, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm"
                            >
                              {spec}
                              {isEditing && (
                                <button
                                  onClick={() => removeSpecialization(index)}
                                  className="hover:text-accent-red"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Education
                      </label>
                      <Textarea
                        value={profileData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                        placeholder="Enter your educational background"
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Certifications
                      </label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add certification"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                addCertification(e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                            disabled={!isEditing}
                          />
                          {isEditing && (
                            <Button
                              variant="outline"
                              onClick={() => {
                                const input = document.querySelector('input[placeholder="Add certification"]') as HTMLInputElement
                                if (input) {
                                  addCertification(input.value)
                                  input.value = ''
                                }
                              }}
                            >
                              Add
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {profileData.certifications.map((cert, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-surface-light/30 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-accent-green" />
                                {cert}
                              </div>
                              {isEditing && (
                                <button
                                  onClick={() => removeCertification(index)}
                                  className="text-accent-red hover:text-accent-red/80"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'personal' && (
                  <motion.div
                    key="personal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-text-primary">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Date of Birth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        leftIcon={<Calendar size={18} />}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Street Address"
                          value={profileData.address.street}
                          onChange={(e) => handleAddressChange('street', e.target.value)}
                          leftIcon={<MapPin size={18} />}
                          disabled={!isEditing}
                        />
                        <Input
                          label="City"
                          value={profileData.address.city}
                          onChange={(e) => handleAddressChange('city', e.target.value)}
                          disabled={!isEditing}
                        />
                        <Input
                          label="State/Province"
                          value={profileData.address.state}
                          onChange={(e) => handleAddressChange('state', e.target.value)}
                          disabled={!isEditing}
                        />
                        <Input
                          label="ZIP/Postal Code"
                          value={profileData.address.zipCode}
                          onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                          disabled={!isEditing}
                        />
                        <Input
                          label="Country"
                          value={profileData.address.country}
                          onChange={(e) => handleAddressChange('country', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'social' && (
                  <motion.div
                    key="social"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-text-primary">Social Links</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="LinkedIn"
                        value={profileData.linkedin}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        leftIcon={<Linkedin size={18} />}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/username"
                      />
                      <Input
                        label="Twitter"
                        value={profileData.twitter}
                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                        leftIcon={<Twitter size={18} />}
                        disabled={!isEditing}
                        placeholder="https://twitter.com/username"
                      />
                      <Input
                        label="Personal Website"
                        value={profileData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        leftIcon={<Globe size={18} />}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    {/* Connected Social Accounts */}
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-4">
                        Connected Accounts
                      </label>
                      <div className="space-y-3">
                        {Object.entries(profileData.socialAccounts).map(([provider, data]) => (
                          <div
                            key={provider}
                            className="flex items-center justify-between p-3 bg-surface-light/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                                {provider === 'google' && <span className="text-sm">G</span>}
                                {provider === 'apple' && <span className="text-sm">A</span>}
                                {provider === 'facebook' && <span className="text-sm">F</span>}
                              </div>
                              <div>
                                <p className="text-text-primary font-medium capitalize">{provider}</p>
                                <p className="text-text-secondary text-sm">{data.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-accent-green text-sm flex items-center gap-1">
                                <CheckCircle size={14} />
                                Connected
                              </span>
                              <Button variant="outline" size="sm">
                                <ExternalLink size={14} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="text-xl font-semibold text-text-primary">Preferences</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Language
                        </label>
                        <select
                          value={profileData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Timezone
                        </label>
                        <select
                          value={profileData.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time</option>
                          <option value="PST">Pacific Time</option>
                          <option value="GMT">GMT</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-4">
                        Notification Preferences
                      </label>
                      <div className="space-y-3">
                        {Object.entries(profileData.notifications).map(([type, enabled]) => (
                          <label key={type} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`notification-${type}`}
                              name={`notification-${type}`}
                              checked={enabled}
                              onChange={(e) => handleNotificationChange(type, e.target.checked)}
                              disabled={!isEditing}
                              className="w-4 h-4 text-primary-500 bg-surface-light border-white/10 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50"
                            />
                            <span className="ml-2 text-text-primary capitalize">
                              {type} notifications
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 