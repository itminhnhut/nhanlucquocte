/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Màu thương hiệu lấy từ trungcapnhanlucquocte.vn (--cl-x, --cl-y trong style.css)
        primary: "#DB1010", // Đỏ chủ đạo
        "primary-dark": "#C70000", // Đỏ đậm khi hover
        secondary: "#0C0975", // Navy phụ (tiêu đề, footer)
        // Giao diện dùng sẵn thang blue-* ở ~50 chỗ → ánh xạ sang thang đỏ,
        // đổi ở đây là cả site đổi theo, không phải sửa từng class.
        blue: {
          50: "#FFF5F5",
          100: "#FFE3E3",
          200: "#FFC9C9",
          300: "#FFA8A8",
          400: "#FF6B6B",
          500: "#F03E3E",
          600: "#DB1010",
          700: "#C70000",
          800: "#A30000",
          900: "#7A0000",
        },
        sky: {
          300: "#FFB3B3",
          400: "#FF8787",
          500: "#F84A4A",
        },
      },
      borderRadius: {
        lgx: "16px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
      },
      maxWidth: {
        "6xl": "72rem", // 1152px
        "7xl": "80rem", // 1280px
        "8xl": "90rem", // 1440px (siêu rộng)
      },
    },
  },
  plugins: [],
};
