import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';
import { useAuth } from '../hooks/useAuth';

const ASIDE_POINTS = [
  { text: 'Всё, что вы оставили, на месте' },
  { text: 'Прогресс — в один взгляд' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { message, showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = 'Введите никнейм';
    if (!password) e.password = 'Введите пароль';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login({ username, password });
      showToast('Входим…');
      setTimeout(() => navigate('/tasks'), 700);
    } catch (err: any) {
      showToast(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout headline="С возвращением!" subtext="Войдите, чтобы продолжить работу со своими задачами." points={ASIDE_POINTS}>
        <h1 className="text-[30px] font-extrabold tracking-tight mb-2">Войти</h1>
        <p className="text-muted text-[15.5px] mb-[30px]">Рады видеть вас снова.</p>

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Никнейм"
            id="username"
            type="text"
            placeholder="ваш никнейм"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            error={errors.username}
          />
          <PasswordField
            label="Пароль"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={errors.password}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full font-bold text-[16px] text-white rounded-full py-[16px] px-6 bg-gradient-to-br from-purple-400 to-accent-600 shadow-accent hover:shadow-accent-hover transition-all active:scale-[.99] disabled:opacity-60"
          >
            {loading ? 'Входим…' : 'Войти'}
          </button>
        </form>

        <p className="text-center text-[14.5px] text-muted mt-[22px]">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-accent-700 font-bold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </AuthLayout>
      <Toast message={message} />
    </>
  );
}
