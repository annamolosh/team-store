# team-store

Командный учебный проект: интернет-магазин книг.

**Стек:** Vite, TypeScript, Vitest (а также ESLint, Prettier, Husky + lint-staged).

## Запуск

```bash
npm ci          # установить зависимости строго по package-lock.json
npm run dev     # dev-сервер Vite
npm test        # прогнать тесты (Vitest)
npm run build   # проверка типов + production-сборка
```

## Ветки

- Всегда создаём ветку от свежего `main` (`git checkout main && git pull`).
- Формат имени: `<тип>/<номер issue>-<суть>`:
  - `feature/12-book-search`: новая функциональность
  - `fix/15-cart-total`: исправление бага
  - `docs/3-readme-rules`: документация
- Напрямую в `main` не пушим.

## Коммиты

Используем [Conventional Commits](https://www.conventionalcommits.org/):

| Префикс  | Когда                           |
| -------- | ------------------------------- |
| `feat:`  | новая функциональность          |
| `fix:`   | исправление бага                |
| `test:`  | тесты                           |
| `docs:`  | документация                    |
| `chore:` | настройка, зависимости, конфиги |

Пример: `feat: add book search by title`.

## Pull Request

1. В описании PR пишем `Closes #N`, чтобы issue закрылась автоматически.
2. Назначаем второго участника в Reviewers.
3. Апрув второго участника обязателен.
4. После апрува PR мержит **автор**.
5. Перед открытием PR проверяем локально: `npm test`, `npm run lint`, `npm run build`.

## Коммуникация

- **Где общаемся:** Discord. Обсуждение по конкретной задаче ведём в issue/PR на GitHub.
- **Созвоны:** раз в неделю или по необходимости (в Discord).
- **Статус:** берёшь задачу — назначаешь её на себя и двигаешь карточку на доске проекта.
- **Если участник не отвечает больше 2 дней**, пишем куратору.

## Деплой

Сайт: https://annamolosh.github.io/team-store/

- Деплой автоматический: при каждом пуше в `main` GitHub Actions прогоняет тесты, собирает проект и публикует его на GitHub Pages.
- Ручной запуск: **Actions → Deploy → Run workflow**.
- Сайт лежит в подпапке `/team-store/` (`base` в `vite.config.ts`). Пути к картинкам из данных строим через `import.meta.env.BASE_URL`, например `${import.meta.env.BASE_URL}images/x.jpg`.
