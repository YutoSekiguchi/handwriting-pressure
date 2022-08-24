# client

- **言語**:JavaScript & TypeScript
- **フレームワーク**:[Next.js](https://nextjs.org/)
    - version: ^12.2.5
- **CSSフレームワーク**:[Tailwind CSS](https://tailwindcss.com/)
- **利用ライブラリ**
  - [Axios](https://axios-http.com/)
  - [Paper.js](http://paperjs.org/)
  - [Chart.js](https://www.chartjs.org/)
  - lscache
  - dotenv
- **開発時のポート**：7150
  - 開発時はDockerで動かすよりも`npm run dev`で動かすこと推奨
    - 今あるDockerfileだと`npm run build`をする設定になってしまっていてIS_PRODUCTION=true(本番環境の設定)になってしまっているため
      - そのうち，書こう

# ディレクトリ構成

```
.
├── /components
├── /hooks
├── /pages
├── /plugins
├── /public
├── /styles
├── /utils
├── .env
├── .eslintrc.json
├── .gitignore
├── Dockerfile
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── yarn.lock
└── README.md
```