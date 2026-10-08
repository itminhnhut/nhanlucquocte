import { useNavigate } from "react-router-dom";

function HeaderSearch() {
  const navigate = useNavigate();

  return (
    <form
      className="flex items-center bg-white border border-blue-400/70 rounded-full px-2 py-1 text-xs"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = (formData.get("q") || "").toString().trim();
        if (q) {
          navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
        } else {
          navigate("/tim-kiem");
        }
      }}
    >
      <input
        type="text"
        name="q"
        placeholder="Tìm kiếm ngành học..."
        aria-label="Tìm kiếm ngành học"
        className="bg-transparent border-none outline-none w-[90%] text-xs"
      />
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-primary-dark text-base hover:bg-blue-50"
      >
        🔍
      </button>
    </form>
  );
}

export default HeaderSearch;
