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
        // API của trường — nguồn dữ liệu duy nhất. Để trống là website không có nội dung động.
        VITE_API_URL: "https://api.trungcapnhanlucquocte.vn/api",
      },
    },
  ],
};
