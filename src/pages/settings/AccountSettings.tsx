import { Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import SettingRow from '../../components/SettingRow'

interface AccountSettingsProps {
  passwordData: { oldPassword: string; newPassword: string; confirmPassword: string }
  setPasswordData: (data: any) => void
  showPasswords: { old: boolean; new: boolean; confirm: boolean }
  setShowPasswords: (data: any) => void
}

export default function AccountSettings({ passwordData, setPasswordData, showPasswords, setShowPasswords }: AccountSettingsProps) {
  const { t } = useLanguage()

  return (
    <>
      <SettingRow label={t('settings.password.old')} hint={t('settings.password.oldHint')}>
        <div className="password-input-wrapper">
          <input
            type={showPasswords.old ? 'text' : 'password'}
            className="form-control"
            value={passwordData.oldPassword}
            onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
            placeholder={t('settings.password.oldPlaceholder')} />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </SettingRow>

      <SettingRow label={t('settings.password.new')} hint={t('settings.password.newHint')}>
        <div className="password-input-wrapper">
          <input
            type={showPasswords.new ? 'text' : 'password'}
            className="form-control"
            value={passwordData.newPassword}
            onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder={t('settings.password.newPlaceholder')} />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </SettingRow>

      <SettingRow label={t('settings.password.confirm')} hint={t('settings.password.confirmHint')} noBorder>
        <div className="password-input-wrapper">
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            className="form-control"
            value={passwordData.confirmPassword}
            onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder={t('settings.password.confirmPlaceholder')} />
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </SettingRow>
    </>
  )
}