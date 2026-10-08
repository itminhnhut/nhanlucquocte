module.exports = {
  apps: [
    {
      name: "education-frontend",
      script: "npm",
      args: "run preview -- --host 0.0.0.0 --port 4001",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 4002,
        // Trống = dùng dữ liệu giả lập trong public/mock; điền URL khi có backend của trường
        VITE_API_URL: "",
      },
    },
  ],
};
