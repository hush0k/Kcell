-- Выполнить в БД intern_test
CREATE SCHEMA IF NOT EXISTS app_fraud;
CREATE TABLE app_fraud.users (
                                 id serial PRIMARY KEY,
                                 username varchar(64) NOT NULL UNIQUE
);
CREATE TABLE app_fraud.tasks (
                                 id serial PRIMARY KEY,
                                 user_id int NOT NULL REFERENCES app_fraud.users(id),
                                 title varchar(200) NOT NULL,
                                 status varchar(20) NOT NULL DEFAULT 'pending',
                                 created_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO app_fraud.users (username) VALUES ('alice'), ('bob');
INSERT INTO app_fraud.tasks (user_id, title, status) VALUES
                                                         (1, 'Проверить отчёт', 'pending'),
                                                         (1, 'Созвон', 'done'),
                                                         (2, 'SQL практика', 'pending');

CREATE OR REPLACE FUNCTION app_fraud.normalize_msisdn(p text)
RETURNS varchar LANGUAGE sql IMMUTABLE AS $$
SELECT '7' || right(regexp_replace(p, '\D', '', 'g'), 10);
$$;

CREATE TABLE app_fraud.msisdn_checks (
                                         id serial PRIMARY KEY,
                                         msisdn varchar(16) NOT NULL,
                                         is_blocked boolean NOT NULL,
                                         checked_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO app_fraud.msisdn_checks (msisdn, is_blocked, checked_at) VALUES
                                                                         ('77001234567', true, now() - interval '2 days'),
                                                                         ('77001234567', false, now() - interval '1 hour'),
                                                                         ('77009998877', false, now());

-- A1 SELECT: задачи пользователя alice со статусом pending (id, title, created_at).
SELECT id, title, created_at FROM app_fraud.tasks
WHERE user_id = (SELECT id FROM app_fraud.users WHERE username = 'alice')
AND status = 'pending';

-- A2 SELECT: число задач done по каждому пользователю (username, cnt).
SELECT u.username, COUNT(*) AS cnt
FROM app_fraud.users u
JOIN app_fraud.tasks t ON u.id = t.user_id
WHERE t.status = 'done'
GROUP BY u.username;

-- A3. Функция app_fraud.last_check_blocked(p_msisdn text) RETURNS boolean — по normalize_msisdn вернуть is_blocked
-- из последней по checked_at записи; если нет записей — NULL.
CREATE OR REPLACE FUNCTION app_fraud.last_check_blocked(p_msisdn text)
RETURNS boolean LANGUAGE sql STABLE AS $$
    SELECT is_blocked
    FROM app_fraud.msisdn_checks
    WHERE msisdn = app_fraud.normalize_msisdn(p_msisdn)
    ORDER BY checked_at DESC
    LIMIT 1;
$$;

-- A4 •	A4. Вызов с параметром из приложения: SELECT ... CAST(:p AS text) ... — в комментарии поясните, зачем CAST
SELECT app_fraud.last_check_blocked(CAST(:p AS text));
-- CAST используется для явного указания типа данных параметра :p, который может быть передан из приложения. Это помогает избежать ошибок типов данных и обеспечивает правильную работу функции, особенно если параметр может быть передан в разных форматах

-- A5 •	A5. CREATE INDEX ... для ускорения поиска последней проверки по msisdn.
CREATE INDEX idx_msisdn_checks_msisdn_checked_at ON app_fraud.msisdn_checks (msisdn, checked_at DESC);















