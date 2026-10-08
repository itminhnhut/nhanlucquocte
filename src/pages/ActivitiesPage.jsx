import StaticArticlePage from "../components/StaticArticlePage";
import { ACTIVITIES_LEAD, ACTIVITIES_PATH, ACTIVITIES_SECTIONS, SCHOOL_EVENTS } from "../content/activities";

// Sắp theo ngày giảm dần (dữ liệu khai dạng dd/mm/yyyy)
const toTime = (date) => {
  const [day, month, year] = date.split("/").map(Number);
  return Date.UTC(year, month - 1, day);
};
const sortedEvents = [...SCHOOL_EVENTS].sort((a, b) => toTime(b.date) - toTime(a.date));

function ActivitiesPage() {
  return (
    <StaticArticlePage
      path={ACTIVITIES_PATH}
      crumb="Hoạt động học viên"
      heading="Hoạt động, sự kiện của học viên và nhà trường"
      lead={ACTIVITIES_LEAD}
      sections={ACTIVITIES_SECTIONS}
    >
      <section aria-labelledby="su-kien" className="mt-8">
        <h2 id="su-kien" className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">
          Hoạt động gần đây
        </h2>
        <ol className="space-y-3">
          {sortedEvents.map((event) => (
            <li key={event.title} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <span className="inline-block rounded-full bg-blue-50 px-3 py-0.5 text-[12px] font-semibold text-primary-dark">
                {event.date}
              </span>
              <h3 className="mt-2 text-[15px] font-bold text-slate-900">{event.title}</h3>
              <p className="mt-1 text-[14px] text-slate-600">{event.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </StaticArticlePage>
  );
}

export default ActivitiesPage;
