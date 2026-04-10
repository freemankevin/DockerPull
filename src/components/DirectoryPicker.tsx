import { useState, useEffect, useCallback } from 'react'
import {
  X, Folder, Home, Monitor, FileText, Download,
  HardDrive, FolderOpen, RotateCcw
} from 'lucide-react'
import { browseApi } from '../api'

interface Directory {
  name: string
  path: string
  isDir: boolean
  modTime?: string
}

interface SpecialDir {
  name: string
  path: string
  icon: string
}

interface Breadcrumb {
  name: string
  path: string
}

interface BrowseResponse {
  current: string
  parent: string
  dirs: Directory[]
  specials?: SpecialDir[]
  breadcrumbs?: Breadcrumb[]
}

interface DirectoryPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (path: string) => void
  initialPath?: string
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home size={16} />,
  desktop: <Monitor size={16} />,
  documents: <FileText size={16} />,
  downloads: <Download size={16} />,
  drive: <HardDrive size={16} />,
  root: <HardDrive size={16} />,
}

export default function DirectoryPicker({ isOpen, onClose, onSelect, initialPath }: DirectoryPickerProps) {
  const [currentPath, setCurrentPath] = useState(initialPath || '')
  const [directories, setDirectories] = useState<Directory[]>([])
  const [specialDirs, setSpecialDirs] = useState<SpecialDir[]>([])
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const [parentPath, setParentPath] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadDirectory = useCallback(async (path: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await browseApi.list(path)
      const data: BrowseResponse = res.data
      setCurrentPath(data.current)
      setDirectories(data.dirs || [])
      setSpecialDirs(data.specials || [])
      setBreadcrumbs(data.breadcrumbs || [])
      setParentPath(data.parent)
    } catch (err: any) {
      setError(err.message || 'Failed to load directory')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadDirectory(initialPath || '.')
    }
  }, [isOpen, initialPath, loadDirectory])

  const handleSelect = () => {
    onSelect(currentPath)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'Enter' && !e.shiftKey) {
      handleSelect()
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '8px',
          width: '720px',
          maxWidth: '90vw',
          height: '560px',
          maxHeight: '90vh',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <FolderOpen size={18} />
            </div>
            <div>
              <div style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}>Select Directory</div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '1px',
              }}>Choose where to save exported images</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '6px',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-tertiary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar - Quick Access */}
          <div style={{
            width: '150px',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '8px 6px 6px',
            }}>
              Quick Access
            </div>
            {specialDirs.map((special) => (
              <button
                key={special.path}
                onClick={() => loadDirectory(special.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 6px',
                  borderRadius: '6px',
                  border: 'none',
                  background: currentPath === special.path
                    ? 'rgba(139, 92, 246, 0.15)'
                    : 'transparent',
                  color: currentPath === special.path
                    ? '#8b5cf6'
                    : 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textAlign: 'left',
                  fontWeight: currentPath === special.path ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (currentPath !== special.path) {
                    e.currentTarget.style.background = 'var(--bg-tertiary)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPath !== special.path) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <span style={{
                  color: currentPath === special.path ? '#8b5cf6' : 'var(--text-muted)',
                  display: 'flex',
                  flexShrink: 0,
                }}>
                  {iconMap[special.icon] || <Folder size={16} />}
                </span>
                {special.name}
              </button>
            ))}
          </div>

          {/* Main Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Breadcrumb Navigation */}
            <div style={{
              padding: '10px 12px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--bg-primary)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                flex: 1,
                overflow: 'hidden',
                minWidth: 0,
              }}>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: index === breadcrumbs.length - 1 ? 0 : 1,
                    minWidth: index === breadcrumbs.length - 1 ? 'auto' : '0',
                    overflow: 'hidden',
                  }}>
                    {index > 0 && (
                      <span style={{
                        color: 'var(--text-muted)',
                        margin: '0 4px',
                        flexShrink: 0,
                      }}>/
                    </span>
                    )}
                    <button
                      onClick={() => loadDirectory(crumb.path)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: index === breadcrumbs.length - 1
                          ? 'var(--text-primary)'
                          : '#8b5cf6',
                        fontSize: '13px',
                        padding: '4px 4px',
                        borderRadius: '4px',
                        fontWeight: index === breadcrumbs.length - 1 ? 500 : 400,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        transition: 'all 0.15s',
                        maxWidth: index === breadcrumbs.length - 1 ? '150px' : '80px',
                      }}
                      onMouseEnter={(e) => {
                        if (index !== breadcrumbs.length - 1) {
                          e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'
                        } else {
                          e.currentTarget.style.background = 'var(--bg-tertiary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                      title={crumb.path}
                    >
                      {crumb.name}
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => loadDirectory(currentPath)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-tertiary)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
                title="Refresh"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Directory List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              background: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* List Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                userSelect: 'none',
              }}>
                <div style={{ flex: 1 }}>Name</div>
                <div style={{ width: '150px', textAlign: 'left', paddingRight: '12px' }}>Date modified</div>
                <div style={{ width: '70px', textAlign: 'left' }}>Type</div>
              </div>

              {/* List Content */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      border: '2px solid var(--border-color)',
                      borderTopColor: '#8b5cf6',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    <div style={{ fontSize: '13px' }}>Loading directories...</div>
                  </div>
                ) : error ? (
                  <div style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#ef4444',
                  }}>
                    <div style={{ fontSize: '13px', marginBottom: '12px' }}>{error}</div>
                    <button
                      onClick={() => loadDirectory(currentPath)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Retry
                    </button>
                  </div>
                ) : directories.length === 0 ? (
                  <div style={{
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                  }}>
                    <Folder size={40} style={{
                      marginBottom: '12px',
                      opacity: 0.5,
                    }} />
                    <div style={{ fontSize: '13px' }}>
                      No folders in this directory
                    </div>
                  </div>
                ) : (
                  <div>
                    {directories.map((dir) => (
                      <div
                        key={dir.path}
                        onClick={() => loadDirectory(dir.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.12s',
                          background: 'var(--bg-primary)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg-tertiary)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'var(--bg-primary)'
                        }}
                        title={dir.name}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          flex: 1,
                          gap: '8px',
                          minWidth: 0,
                        }}>
                          <Folder size={16} style={{
                            color: '#8b5cf6',
                            flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: '13px',
                            color: 'var(--text-primary)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {dir.name}
                          </span>
                        </div>
                        <div style={{
                          width: '150px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          flexShrink: 0,
                          paddingRight: '12px',
                          whiteSpace: 'nowrap',
                        }}>
                          {dir.modTime ? new Date(dir.modTime).toLocaleString() : '--'}
                        </div>
                        <div style={{
                          width: '70px',
                          textAlign: 'left',
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          flexShrink: 0,
                          whiteSpace: 'nowrap',
                        }}>
                          File folder
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-secondary)',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              width: 'auto',
              height: 'auto',
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSelect}
            disabled={loading}
            style={{
              padding: '8px 20px',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              width: 'auto',
              height: 'auto',
              minWidth: '72px',
            }}
          >
            Select
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
