import InlineText from "./InlineText";

export const sectionId = (index) => `muc-${index + 1}`;

function GuideTable({ table }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full text-left text-[12px] sm:text-[13px]">
        <thead className="bg-blue-50 text-primary-dark">
          <tr>
            {table.head.map((cell) => (
              <th key={cell} scope="col" className="px-2 sm:px-3 py-2 font-semibold">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {table.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row" className="px-2 sm:px-3 py-2 font-semibold text-slate-800">
                    {cell}
                  </th>
                ) : (
                  <td key={index} className="px-2 sm:px-3 py-2">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Các mục nội dung soạn trong src/content/* (H2 + bảng/danh sách/đoạn văn, link [chữ](/url), **đậm**) */
function ContentSections({ sections }) {
  return sections.map((section, index) => (
    <section key={section.heading} id={sectionId(index)} className="mt-8 scroll-mt-24">
      <h2 className="text-[19px] md:text-[21px] font-bold text-primary-dark mb-3">{section.heading}</h2>
      {section.intro && (
        <p className="mb-3">
          <InlineText text={section.intro} />
        </p>
      )}
      {section.table && <GuideTable table={section.table} />}
      {section.list && (
        <ul className="list-disc pl-5 space-y-2">
          {section.list.map((item) => (
            <li key={item}>
              <InlineText text={item} />
            </li>
          ))}
        </ul>
      )}
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-3">
          <InlineText text={paragraph} />
        </p>
      ))}
    </section>
  ));
}

export default ContentSections;
