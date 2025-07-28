'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, X, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange: (avatar: string) => void
  disabled?: boolean
}

export default function AvatarUpload({ currentAvatar, onAvatarChange, disabled = false }: AvatarUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onAvatarChange(result)
      toast.success('Avatar updated successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeAvatar = () => {
    setPreview(null)
    onAvatarChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Avatar removed')
  }

  const displayAvatar = preview || currentAvatar

  return (
    <div className="relative">
      {/* Avatar Display */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
          {displayAvatar ? (
            <img 
              src={displayAvatar} 
              alt="Profile Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={32} />
          )}
        </div>
        
        {/* Upload Button */}
        {!disabled && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary-500 p-2 rounded-full hover:bg-primary-600 transition-colors shadow-lg"
            title="Upload avatar"
          >
            <Camera size={16} />
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        id="avatar-upload"
        name="avatar"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drag & Drop Area */}
      {!disabled && (
        <motion.div
          className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${
            isDragging 
              ? 'border-primary-400 bg-primary-400/10' 
              : 'border-white/20 hover:border-primary-400/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={24} className="mx-auto mb-2 text-text-muted" />
          <p className="text-sm text-text-secondary mb-1">
            Drag and drop an image here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-400 hover:text-primary-300 underline"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-text-muted">
            PNG, JPG, GIF up to 5MB
          </p>
        </motion.div>
      )}

      {/* Remove Button */}
      {displayAvatar && !disabled && (
        <div className="mt-3 text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={removeAvatar}
            className="text-accent-red hover:text-accent-red/80"
          >
            <X size={14} className="mr-1" />
            Remove Avatar
          </Button>
        </div>
      )}
    </div>
  )
} 