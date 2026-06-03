import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const ASIDE_POINTS = [
  { text: 'Один клик — задача готова' },
  { text: 'Сортировка и фильтры' },
  { text: 'Наглядный прогресс' },
];

const PWD_CHECKS = [
  { key: 'len', label: 'Минимум 8 символов', test: (v: string) => v.length >= 8 },
  { key: 'upper', label: 'Заглавная буква', test: (v: string) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'Строчная буква', test: (v: string) => /[a-z]/.test(v) },
  { key: 'digit', label: 'Цифра', test: (v: string) => /\d/.test(v) },
  { key: 'special', label: 'Спецсимвол @$!%*?&_', test: (v: string) => /[@$!_%*?&]/.test(v) },
];

const PWD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!_%*?&])[A-Za-z\d@$!%*?&_]{8,}$/;

function PasswordRules({ password }: { password: string }) {
  return (
    <div className="grid grid-cols-2 gap-[7px_16px] mt-[10px] p-[13px_15px] bg-accent-softer border border-border rounded-[16px]">
      {PWD_CHECKS.map(({ key, label, test }) => {
        const ok = test(password);
        return (
          <div key={key} className={`flex items-center gap-2 text-[12.5px] font-semibold transition-colors ${ok ? 'text-done' : 'text-muted'}`}>
            <span
              className={`w-[17px] h-[17px] rounded-full flex-none grid place-items-center border-2 transition-all ${
                ok ? 'bg-done border-done' : 'border-[#d8ccc1]'
              }`}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ opacity: ok ? 1 : 0 }}>
                <path d="M5 12.5l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { message, showToast } = useToast();

  const [form, setForm] = useState({ username: '', firstName: '', lastName: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.username.trim()) e.username = 'Введите никнейм';
    else if (form.username.trim().length < 3) e.username = 'Минимум 3 символа';
    else if (!/^[A-Za-z0-9_]+$/.test(form.username)) e.username = 'Только латиница, цифры и _';
    if (!form.firstName.trim()) e.firstName = 'Введите имя';
    if (!form.lastName.trim()) e.lastName = 'Введите фамилию';
    if (!PWD_RE.test(form.password)) e.password = 'Пароль не соответствует требованиям';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        password: form.password,
      });
      showToast('Аккаунт создан! Перенаправляем…');
      setTimeout(() => navigate('/login'), 1100);
    } catch (err: any) {
      showToast(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout
        headline="Задачи под контролем — без лишнего."
        subtext="Создавайте, сортируйте и отмечайте задачи выполненными. Всё просто и наглядно."
        points={ASIDE_POINTS}
      >
        <h1 className="text-[30px] font-extrabold tracking-tight mb-2">Создать аккаунт</h1>
        <p className="text-muted text-[15.5px] mb-[30px]">Заполните данные, чтобы начать работу.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Никнейм"
            id="username"
            type="text"
            placeholder="например, alex_99"
            autoComplete="username"
            value={form.username}
            onChange={set('username')}
            error={errors.username}
          />

          <div className="grid grid-cols-2 gap-[14px]">
            <FormField
              label="Имя"
              id="firstName"
              type="text"
              placeholder="Иван"
              autoComplete="given-name"
              value={form.firstName}
              onChange={set('firstName')}
              error={errors.firstName}
            />
            <FormField
              label="Фамилия"
              id="lastName"
              type="text"
              placeholder="Петров"
              autoComplete="family-name"
              value={form.lastName}
              onChange={set('lastName')}
              error={errors.lastName}
            />
          </div>

          <div className="mb-[10px]">
            <PasswordField
              label="Пароль"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
            />
          </div>

          <PasswordRules password={form.password} />

          <button
            type="submit"
            disabled={loading}
            className="mt-[22px] w-full font-bold text-[16px] text-white rounded-full py-[16px] px-6 bg-gradient-to-br from-purple-400 to-accent-600 shadow-accent hover:shadow-accent-hover transition-all active:scale-[.99] disabled:opacity-60"
          >
            {loading ? 'Создаём…' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-[14.5px] text-muted mt-[22px]">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-accent-700 font-bold hover:underline">
            Войти
          </Link>
        </p>
      </AuthLayout>
      <Toast message={message} />
    </>
  );
}
