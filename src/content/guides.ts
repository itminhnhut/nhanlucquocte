// Bài cẩm nang tuyển sinh (/cam-nang/<slug>): nội dung tĩnh trong code.
// Giai đoạn 1 chưa có bài nào cho Trường Trung cấp nghề Nhân Lực Quốc Tế — mục Cẩm nang tạm tắt
// trong src/configs/navigation.ts. Bài của site cũ giữ ở docs/tham-khao/guides-viet-uc.ts.txt để
// tham khảo cấu trúc; KHÔNG bê nội dung sang vì học phí, địa chỉ, ngành đều khác.
import appConfig from "../configs/appConfig";

export interface GuideTable {
  head: readonly string[];
  rows: readonly (readonly string[])[];
}

export interface GuideSection {
  heading: string;
  /** Câu dẫn đứng trước bảng/danh sách */
  intro?: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  table?: GuideTable;
}

export interface Guide {
  slug: string;
  /** Từ khoá chính (chữ thường): phải có trong title, H1, description (src/seo/keywords.ts) */
  keyword: string;
  /** H1 và headline của Article */
  title: string;
  /** Thẻ <title> (≤ 60 ký tự, có hậu tố thương hiệu nếu vừa) */
  metaTitle: string;
  /** Meta description ≤ 160 ký tự */
  description: string;
  /** Tóm tắt trên thẻ bài ở /cam-nang */
  excerpt: string;
  datePublished: string;
  dateModified: string;
  /** Đoạn mở đầu: nêu thẳng câu trả lời (dễ được Google/AI trích dẫn) */
  lead: string;
  sections: readonly GuideSection[];
}

export const GUIDES_PATH = "/cam-nang";

const CONTACT_LINE = `Gọi hotline ${appConfig.phone}, nhắn Zalo hoặc [đăng ký tư vấn](/#register) để được tư vấn miễn phí theo hoàn cảnh của bạn.`;
const PROGRAMS = "[chương trình đào tạo](/nganh-dao-tao)";
const ADMISSION = "[thông tin tuyển sinh](/tuyen-sinh)";

const PUBLISHED = "2026-10-08";

export const GUIDES: readonly Guide[] = [
  {
    slug: "tot-nghiep-lop-9-nen-hoc-gi",
    keyword: "tốt nghiệp lớp 9 nên học gì",
    title: "Tốt nghiệp lớp 9 nên học gì? 3 hướng đi và cách chọn",
    metaTitle: "Tốt nghiệp lớp 9 nên học gì? 3 hướng đi phổ biến",
    description:
      "Tốt nghiệp lớp 9 nên học gì: học tiếp THPT, học trung cấp nghề song song văn hóa, hay học khóa sơ cấp đi làm sớm. So sánh thời gian, bằng cấp và đường học tiếp.",
    excerpt:
      "Ba hướng đi sau lớp 9 và cách chọn theo học lực, hoàn cảnh gia đình và nghề muốn làm.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Tốt nghiệp lớp 9 nên học gì? Có ba hướng: học tiếp THPT rồi thi đại học, học trung cấp nghề và học thêm văn hóa THPT (học xong có bằng trung cấp, vẫn liên thông lên cao đẳng, đại học), hoặc học một khóa sơ cấp ngắn hạn để đi làm sớm rồi học tiếp sau.",
    sections: [
      {
        heading: "Ba hướng đi sau khi tốt nghiệp THCS",
        table: {
          head: ["Hướng đi", "Thời gian", "Kết quả"],
          rows: [
            ["Học THPT", "3 năm", "Bằng tốt nghiệp THPT, xét tuyển cao đẳng, đại học"],
            ["Học trung cấp nghề", "Tính theo năm học, kèm khối lượng văn hóa THPT", "Bằng trung cấp, có nghề, được học liên thông"],
            ["Khóa sơ cấp", "Ngắn hạn, tùy nghề", "Chứng chỉ nghề, đi làm sớm"],
          ],
        },
        paragraphs: [
          "Người tốt nghiệp THCS được học trình độ trung cấp và học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo. Vì vậy chọn học nghề sớm không có nghĩa là đóng lại đường học lên.",
        ],
      },
      {
        heading: "Nên chọn hướng nào?",
        list: [
          "**Học lực khá, muốn học lên đại học:** học tiếp THPT là đường thẳng nhất.",
          "**Muốn có nghề và đi làm sớm, gia đình cần giảm chi phí:** học trung cấp nghề, vừa có bằng vừa có tay nghề; học xong vẫn liên thông được.",
          "**Chưa chắc chắn, muốn thử nghề trước:** học một khóa sơ cấp ngắn hạn (bảo mẫu, chăm sóc da, pha chế, nấu ăn…) rồi quyết định học tiếp.",
        ],
        paragraphs: [
          `Xem ${PROGRAMS} và ${ADMISSION} của trường để biết ngành nào nhận học viên tốt nghiệp THCS. Giấy tờ cần chuẩn bị khi nộp xem bài [hồ sơ nhập học trung cấp](/cam-nang/ho-so-nhap-hoc-trung-cap). ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "nen-hoc-nghe-gi",
    keyword: "nên học nghề gì",
    title: "Nên học nghề gì? Cách chọn nghề hợp với mình",
    metaTitle: "Nên học nghề gì? Cách chọn nghề hợp với mình",
    description:
      "Nên học nghề gì cho dễ xin việc: cách chọn theo sở thích, sức khỏe, vốn đầu tư và nhu cầu tuyển dụng, kèm nhóm nghề đang đào tạo tại TPHCM.",
    excerpt: "Bốn câu hỏi giúp bạn chọn nghề, kèm các nhóm nghề đang tuyển sinh tại trường.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Nên học nghề gì không có câu trả lời chung: hãy chọn nghề mà bạn chịu được công việc hằng ngày của nó, phù hợp sức khỏe và điều kiện gia đình, và đang có chỗ tuyển dụng ở nơi bạn sống.",
    sections: [
      {
        heading: "Bốn câu hỏi trước khi chọn nghề",
        list: [
          "**Công việc mỗi ngày của nghề đó là gì?** Ví dụ điều dưỡng phải trực ca và tiếp xúc người bệnh; bếp phải đứng lâu, làm theo giờ nhà hàng.",
          "**Sức khỏe và tính cách có hợp không?** Nghề chăm sóc cần kiên nhẫn, nghề kỹ thuật cần cẩn thận và không ngại dầu mỡ, máy móc.",
          "**Học xong cần bao nhiêu vốn để làm nghề?** Nghề làm đẹp, pha chế có thể mở tiệm nhỏ; nghề điều dưỡng, kế toán thì đi làm cho cơ sở, doanh nghiệp.",
          "**Nơi bạn sống có chỗ tuyển không?** Xem tin tuyển dụng thật của nghề đó trong bán kính bạn đi làm được.",
        ],
      },
      {
        heading: "Các nhóm nghề đang đào tạo",
        list: [
          "**Y tế – chăm sóc sức khỏe:** điều dưỡng, dược, chăm sóc người cao tuổi, trợ lý nha khoa.",
          "**Chăm sóc sắc đẹp:** chăm sóc sắc đẹp hệ trung cấp, chăm sóc da, nails, liệu pháp làm đẹp.",
          "**Ẩm thực – nhà hàng – khách sạn:** chế biến món ăn, làm bánh, pha chế, lễ tân, quản trị khách sạn.",
          "**Kỹ thuật – xây dựng – nội thất:** kỹ thuật xây dựng, sửa chữa ô tô, mộc và trang trí nội thất.",
          "**Kinh tế – công nghệ:** kế toán doanh nghiệp, quản trị kinh doanh, công nghệ thông tin.",
        ],
        paragraphs: [
          `Chi tiết từng nghề xem ở ${PROGRAMS}. Chưa chắc chắn thì đọc thêm [tốt nghiệp lớp 9 nên học gì](/cam-nang/tot-nghiep-lop-9-nen-hoc-gi) và [nên học trung cấp hay cao đẳng](/cam-nang/nen-hoc-trung-cap-hay-cao-dang). Xem riêng từng nghề: [học điều dưỡng ra làm gì](/cam-nang/hoc-dieu-duong-ra-lam-gi), [học chăm sóc sắc đẹp học gì](/cam-nang/hoc-cham-soc-sac-dep-hoc-gi); muốn ra nước ngoài làm việc thì đọc [học nghề đi làm việc ở nước ngoài](/cam-nang/hoc-nghe-di-lam-viec-nuoc-ngoai). ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "nen-hoc-trung-cap-hay-cao-dang",
    keyword: "nên học trung cấp hay cao đẳng",
    title: "Nên học trung cấp hay cao đẳng? So sánh để chọn đúng",
    metaTitle: "Nên học trung cấp hay cao đẳng? So sánh nhanh",
    description:
      "Nên học trung cấp hay cao đẳng: khác nhau về đầu vào, thời gian học, bằng cấp và đường liên thông. Bảng so sánh ngắn giúp bạn chọn theo hoàn cảnh.",
    excerpt: "Khác nhau giữa trung cấp và cao đẳng về đầu vào, thời gian, bằng cấp và liên thông.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Nên học trung cấp hay cao đẳng phụ thuộc vào bằng bạn đang có và thời gian bạn dành được: trung cấp nhận cả người tốt nghiệp THCS và học nhanh hơn, cao đẳng yêu cầu tốt nghiệp THPT và học dài hơn. Cả hai đều học liên thông lên bậc cao hơn được.",
    sections: [
      {
        heading: "So sánh trung cấp và cao đẳng",
        table: {
          head: ["Tiêu chí", "Trung cấp", "Cao đẳng"],
          rows: [
            ["Đầu vào", "Tốt nghiệp THCS hoặc THPT", "Tốt nghiệp THPT"],
            ["Thời gian", "Tính theo năm học, ngắn hơn cao đẳng", "Dài hơn trung cấp"],
            ["Bằng cấp", "Bằng tốt nghiệp trung cấp", "Bằng tốt nghiệp cao đẳng"],
            ["Học tiếp", "Liên thông cao đẳng, đại học", "Liên thông đại học"],
          ],
        },
      },
      {
        heading: "Chọn theo hoàn cảnh",
        list: [
          "**Chưa có bằng THPT:** học trung cấp là đường vào nghề sớm nhất, học thêm văn hóa THPT theo quy định.",
          "**Cần đi làm sớm, giảm chi phí:** trung cấp thời gian ngắn hơn, học phí thường thấp hơn.",
          "**Đã tốt nghiệp THPT và muốn đi xa hơn ngay:** cân nhắc cao đẳng, hoặc học trung cấp rồi liên thông.",
        ],
        paragraphs: [
          `Trường Trung cấp nghề Nhân Lực Quốc Tế đào tạo trình độ trung cấp và sơ cấp, đồng thời có chương trình [liên thông đại học sau trung cấp](/cam-nang/lien-thong-dai-hoc-sau-trung-cap). ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "lien-thong-dai-hoc-sau-trung-cap",
    keyword: "liên thông đại học sau trung cấp",
    title: "Liên thông đại học sau trung cấp: điều kiện và lộ trình",
    metaTitle: "Liên thông đại học sau trung cấp: điều kiện, lộ trình",
    description:
      "Liên thông đại học sau trung cấp cần điều kiện gì, học bao lâu, chọn ngành thế nào và hồ sơ gồm những gì — hướng dẫn ngắn cho người đã có bằng trung cấp.",
    excerpt: "Điều kiện, lộ trình và hồ sơ khi học liên thông lên đại học sau khi có bằng trung cấp.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Liên thông đại học sau trung cấp là việc người đã có bằng tốt nghiệp trung cấp học tiếp để lấy bằng đại học. Điều kiện dự tuyển và thời gian học do cơ sở đào tạo quy định, thường xét cả ngành đã học ở trung cấp.",
    sections: [
      {
        heading: "Điều kiện thường gặp",
        list: [
          "Đã tốt nghiệp trung cấp chuyên nghiệp hoặc trung cấp nghề **và** có bằng tốt nghiệp THPT hoặc giấy chứng nhận hoàn thành chương trình THPT.",
          "Ngành liên thông cùng nhóm với ngành đã học, hoặc học bổ sung kiến thức theo yêu cầu của trường đại học.",
          "Đáp ứng điều kiện tuyển sinh của cơ sở đào tạo trong năm tuyển sinh đó.",
        ],
        paragraphs: [
          "Việc liên thông giữa trung học nghề, trung cấp, cao đẳng và đại học hiện thực hiện theo **Thông tư 52/2026/TT-BGDĐT** của Bộ Giáo dục và Đào tạo, có hiệu lực từ **15/08/2026**: người học được công nhận kết quả học tập đã tích lũy, không phải học lại nội dung đã được công nhận, nhưng phải hoàn thành **tối thiểu 50% chương trình** tại cơ sở cấp bằng. Hãy hỏi lại nhà trường để nắm điều kiện cụ thể trước khi nộp hồ sơ.",
        ],
      },
      {
        heading: "Chuẩn bị gì cho suôn sẻ",
        list: [
          "Giữ bằng, bảng điểm trung cấp và giấy tờ cá nhân đầy đủ.",
          "Chọn ngành liên thông gần với nghề đang làm để dùng được kinh nghiệm thực tế.",
          "Hỏi rõ lịch học (ngoài giờ, cuối tuần) để sắp xếp với công việc.",
        ],
        paragraphs: [
          `Chương trình liên thông do **Trường Đại học Công nghệ và Quản lý Hữu Nghị** tổ chức tuyển sinh và cấp bằng, Trường Trung cấp nghề Nhân Lực Quốc Tế là đơn vị liên kết tiếp nhận hồ sơ và bố trí địa điểm học. Các ngành đã thông báo: Quản trị dịch vụ ăn uống và ẩm thực, Quản trị dịch vụ du lịch và lữ hành. Xem ${ADMISSION}. ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "hoc-dieu-duong-ra-lam-gi",
    keyword: "học điều dưỡng ra làm gì",
    title: "Học điều dưỡng ra làm gì? Công việc và nơi làm việc",
    metaTitle: "Học điều dưỡng ra làm gì? Công việc, nơi làm việc",
    description:
      "Học điều dưỡng ra làm gì: công việc hằng ngày của điều dưỡng viên, nơi tuyển dụng, yêu cầu sức khỏe và tính cách, học trung cấp mất bao lâu tại TPHCM.",
    excerpt: "Công việc thật của điều dưỡng viên, nơi làm việc và điều kiện cần có trước khi chọn nghề.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Học điều dưỡng ra làm gì? Điều dưỡng viên chăm sóc người bệnh hằng ngày: theo dõi dấu hiệu sinh tồn, thực hiện y lệnh của bác sĩ, hỗ trợ ăn uống – vệ sinh – vận động và hướng dẫn người bệnh, làm việc tại bệnh viện, phòng khám, trung tâm y tế và cơ sở chăm sóc người cao tuổi.",
    sections: [
      {
        heading: "Công việc hằng ngày",
        list: [
          "Tiếp nhận, theo dõi người bệnh: đo mạch, huyết áp, nhiệt độ, nhịp thở và ghi hồ sơ.",
          "Thực hiện y lệnh: tiêm, thay băng, cho uống thuốc, chuẩn bị dụng cụ và phụ giúp thủ thuật.",
          "Chăm sóc cơ bản: hỗ trợ ăn uống, vệ sinh, vận động, phòng loét tì đè cho người bệnh nằm lâu.",
          "Hướng dẫn người bệnh và người nhà cách tự chăm sóc sau khi ra viện.",
        ],
      },
      {
        heading: "Làm việc ở đâu",
        list: [
          "Bệnh viện, trung tâm y tế, trạm y tế.",
          "Phòng khám đa khoa, chuyên khoa, phòng tiêm chủng.",
          "Trung tâm dưỡng lão, cơ sở chăm sóc người cao tuổi, chăm sóc tại nhà.",
          "Phòng y tế của trường học, nhà máy, doanh nghiệp.",
        ],
      },
      {
        heading: "Hợp với ai, cần chuẩn bị gì",
        list: [
          "Kiên nhẫn, cẩn thận, chịu được áp lực và lịch trực.",
          "Giao tiếp tốt với người bệnh và người nhà, giữ bình tĩnh trong tình huống gấp.",
          "Sức khỏe ổn định để đứng và di chuyển nhiều trong ca làm việc.",
        ],
        paragraphs: [
          `Thời gian học trung cấp khác nhau theo từng ngành và do chương trình đào tạo của trường quy định; người tốt nghiệp THCS học thêm khối lượng kiến thức văn hóa THPT theo quy định của Bộ Giáo dục và Đào tạo. Giấy tờ cần nộp khi vào học xem bài [hồ sơ nhập học trung cấp](/cam-nang/ho-so-nhap-hoc-trung-cap). Xem ${ADMISSION} hoặc ${PROGRAMS}. ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "hoc-cham-soc-sac-dep-hoc-gi",
    keyword: "học chăm sóc sắc đẹp học gì",
    title: "Học chăm sóc sắc đẹp học gì, bao lâu, ra làm gì?",
    metaTitle: "Học chăm sóc sắc đẹp học gì, bao lâu, ra làm gì?",
    description:
      "Học chăm sóc sắc đẹp học gì: chăm sóc da, nails, liệu pháp làm đẹp; học trung cấp hay khóa ngắn hạn, thời gian học và công việc sau khi ra nghề tại TPHCM.",
    excerpt: "Phân biệt hệ trung cấp và khóa ngắn hạn, nội dung nghề và hướng đi sau khi học.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Học chăm sóc sắc đẹp học gì? Người học được rèn các kỹ thuật phục vụ khách hàng trong nghề làm đẹp: chăm sóc da, chăm sóc móng, liệu pháp làm đẹp, cách dùng thiết bị chuyên ngành và tư vấn sản phẩm phù hợp với khách.",
    sections: [
      {
        heading: "Hệ trung cấp hay khóa ngắn hạn?",
        table: {
          head: ["Tiêu chí", "Hệ trung cấp", "Khóa ngắn hạn"],
          rows: [
            ["Kết quả", "Bằng tốt nghiệp trung cấp", "Chứng chỉ nghề"],
            ["Thời gian", "Tính theo năm học", "Ngắn hạn, tùy nghề"],
            ["Phù hợp với", "Muốn có bằng, học bài bản, học tiếp liên thông", "Muốn vào nghề nhanh, bổ sung một kỹ năng cụ thể"],
          ],
        },
        paragraphs: [
          "Trường đào tạo Chăm sóc sắc đẹp hệ trung cấp và khóa ngắn hạn Chăm sóc nails. Hai nghề Beauty Therapy và Chăm sóc da nhà trường chưa công bố hệ đào tạo, nên chưa xếp được vào cột nào ở bảng trên — hãy gọi hotline để hỏi.",
        ],
      },
      {
        heading: "Ra nghề làm gì",
        list: [
          "Kỹ thuật viên chăm sóc da, chăm sóc móng tại spa, viện thẩm mỹ.",
          "Nhân viên tư vấn, chăm sóc khách hàng cho spa và công ty mỹ phẩm.",
          "Tự mở tiệm nhỏ sau khi có tay nghề và lượng khách quen.",
        ],
        paragraphs: [
          `Chưa rõ nên học hệ nào, đọc thêm [nên học trung cấp hay cao đẳng](/cam-nang/nen-hoc-trung-cap-hay-cao-dang); giấy tờ cần nộp khi vào học ở bài [hồ sơ nhập học trung cấp](/cam-nang/ho-so-nhap-hoc-trung-cap). ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "ho-so-nhap-hoc-trung-cap",
    keyword: "hồ sơ nhập học trung cấp",
    title: "Hồ sơ nhập học trung cấp gồm những gì?",
    metaTitle: "Hồ sơ nhập học trung cấp gồm những gì? Chuẩn bị sao",
    description:
      "Hồ sơ nhập học trung cấp gồm những giấy tờ gì, chuẩn bị thế nào cho nhanh, trường hợp chưa có bằng tốt nghiệp thì làm sao — hướng dẫn cho người học tại TPHCM.",
    excerpt: "Danh mục giấy tờ cơ bản, cách chuẩn bị và các trường hợp thường gặp khi nộp hồ sơ.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Hồ sơ nhập học trung cấp về cơ bản gồm giấy tờ chứng minh trình độ đã tốt nghiệp (THCS hoặc THPT), giấy tờ tùy thân và các giấy tờ ưu tiên nếu thuộc diện chính sách. Chuẩn bị hồ sơ đầy đủ ngay từ đầu giúp bạn nhập học đúng đợt khai giảng mong muốn.",
    sections: [
      {
        heading: "Giấy tờ cơ bản",
        list: [
          "Bằng hoặc giấy chứng nhận tốt nghiệp THCS/THPT (bản sao có chứng thực); học liên thông thì thêm bằng trung cấp.",
          "Căn cước công dân — số CCCD này cũng dùng để [tra cứu văn bằng](/tra-cuu-van-bang) sau khi tốt nghiệp.",
          "Ảnh thẻ theo yêu cầu của từng đợt nhập học.",
          "Giấy tờ ưu tiên hoặc giấy tờ theo diện chính sách, nếu nhà trường yêu cầu khi nhận hồ sơ — hãy hỏi trước khi nộp.",
        ],
      },
      {
        heading: "Các trường hợp thường gặp",
        list: [
          "**Vừa thi xong, chưa có bằng:** dùng giấy chứng nhận tốt nghiệp tạm thời, nộp bổ sung bằng chính sau.",
          "**Mất bằng gốc:** xin bản sao từ sổ gốc tại nơi đã cấp bằng.",
          "**Đang đi làm, ở tỉnh:** gửi trước thông tin qua hotline hoặc Zalo để được hướng dẫn, tránh đi lại nhiều lần.",
        ],
        paragraphs: [
          `Danh mục chi tiết theo từng đợt được nhà trường gửi khi tư vấn. Xem thêm ${ADMISSION}. ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "hoc-nghe-di-lam-viec-nuoc-ngoai",
    keyword: "học nghề đi làm việc ở nước ngoài",
    title: "Học nghề đi làm việc ở nước ngoài cần chuẩn bị gì?",
    metaTitle: "Học nghề đi làm việc ở nước ngoài cần chuẩn bị gì?",
    description:
      "Học nghề đi làm việc ở nước ngoài: cần tay nghề gì, ngoại ngữ bao lâu, giấy tờ và những điều phải kiểm tra trước khi ký hợp đồng với đơn vị tổ chức.",
    excerpt: "Lộ trình từ học nghề, học ngoại ngữ đến chuẩn bị hồ sơ và tránh rủi ro.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Học nghề đi làm việc ở nước ngoài thường gồm ba phần: có một nghề cụ thể và chứng chỉ/bằng chứng minh, học ngoại ngữ của nước đến, và chuẩn bị hồ sơ qua đơn vị có giấy phép. Phần mất nhiều thời gian nhất là ngoại ngữ, nên bắt đầu sớm.",
    sections: [
      {
        heading: "Ba bước chuẩn bị",
        list: [
          "**Chọn nghề và học cho có chứng chỉ, bằng cấp:** nghề càng rõ thì càng dễ được tiếp nhận.",
          "**Học ngoại ngữ theo nước đến:** trường có khóa tiếng Hàn; các ngoại ngữ khác tùy thị trường.",
          "**Kỹ năng mềm và hiểu văn hóa nơi đến:** tác phong, nếp sinh hoạt, quy định lao động cơ bản.",
        ],
        paragraphs: [
          "Trường được thành lập để nâng cao chất lượng nguồn nhân lực đi làm việc ở nước ngoài; giai đoạn 2008–2012 đã đào tạo hơn 20.000 lao động cho các thị trường Nhật Bản, Hàn Quốc, Đài Loan.",
        ],
      },
      {
        heading: "Những điều phải kiểm tra trước khi ký",
        list: [
          "Đơn vị tổ chức có giấy phép hoạt động dịch vụ đưa người lao động đi làm việc ở nước ngoài hay không.",
          "Hợp đồng ghi rõ công việc, nơi làm việc, thời hạn, lương, chi phí và các khoản phải nộp.",
          "Mọi khoản tiền đều có phiếu thu, không nộp cho cá nhân không có tư cách đại diện.",
          "Giữ bản sao toàn bộ giấy tờ đã nộp.",
        ],
        paragraphs: [
          `Xem thêm trang [Du học](/du-hoc) và các [hợp tác với doanh nghiệp, thị trường lao động ngoài nước](/hop-tac-doanh-nghiep) của trường. ${CONTACT_LINE}`,
        ],
      },
    ],
  },
  {
    slug: "truong-trung-cap-nghe-tan-binh",
    keyword: "trường trung cấp nghề ở tân bình",
    title: "Trường trung cấp nghề ở Tân Bình: học gì, đi lại thế nào",
    metaTitle: "Trường trung cấp nghề ở Tân Bình học gì, đi thế nào?",
    description:
      "Trường trung cấp nghề ở Tân Bình, TPHCM: ngành đang đào tạo, đối tượng tuyển sinh, đường đi từ Gò Vấp, Quận 12, Phú Nhuận và cách đăng ký tư vấn.",
    excerpt: "Ngành đào tạo, đối tượng tuyển sinh và đường đến trường tại Tân Bình, TPHCM.",
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    lead:
      "Trường trung cấp nghề ở Tân Bình phù hợp với người học tại khu vực Tân Bình, Tân Phú, Phú Nhuận, Gò Vấp và Quận 12 vì đi lại gần. Trường Trung cấp nghề Nhân Lực Quốc Tế nằm ở số 6 Phan Đình Giót, ngay trục đường vào sân bay Tân Sơn Nhất.",
    sections: [
      {
        heading: "Học được những nghề nào tại đây",
        paragraphs: [
          `Trường đào tạo hệ trung cấp và các khóa sơ cấp thuộc các nhóm: y tế – chăm sóc sức khỏe, chăm sóc sắc đẹp, ẩm thực – nhà hàng – khách sạn, kỹ thuật – xây dựng – nội thất, kinh tế – công nghệ thông tin, cùng khóa tiếng Hàn và nghề ngắn hạn. Danh sách đầy đủ ở ${PROGRAMS}, điều kiện và hồ sơ ở ${ADMISSION}.`,
        ],
      },
      {
        heading: "Đường đến trường",
        list: [
          "**Từ Quận 1:** đi Cách Mạng Tháng Tám hoặc Nam Kỳ Khởi Nghĩa hướng sân bay, tới Lăng Cha Cả rẽ vào Phan Đình Giót.",
          "**Từ Gò Vấp, Quận 12, Bình Thạnh:** theo Nguyễn Kiệm – Hoàng Văn Thụ về Lăng Cha Cả rồi vào Phan Đình Giót.",
          "**Xe buýt:** các tuyến qua Hoàng Văn Thụ – Trường Sơn, xuống trạm Lăng Cha Cả và đi bộ vào trường.",
        ],
        paragraphs: [
          `Xem bản đồ và giờ làm việc ở trang [Liên hệ](/lien-he). ${CONTACT_LINE}`,
        ],
      },
    ],
  },
];

export function guideBySlug(slug: string | undefined): Guide | null {
  return GUIDES.find((guide) => guide.slug === slug) ?? null;
}

export const guidePath = (slug: string) => `${GUIDES_PATH}/${slug}`;

const GUIDE_LINK_PATTERN = new RegExp(`\\]\\(${GUIDES_PATH}/([a-z0-9-]+)\\)`, "g");

function linkedGuideSlugs(guide: Guide): string[] {
  const text = [guide.lead, ...guide.sections.flatMap((s) => [...(s.paragraphs ?? []), ...(s.list ?? [])])].join("\n");
  return [...text.matchAll(GUIDE_LINK_PATTERN)].map((match) => match[1]);
}

/** Bài để gợi ý đọc tiếp: bài được nhắc trong nội dung trước, sau đó các bài còn lại */
export function otherGuides(slug: string, limit = 3): Guide[] {
  const current = guideBySlug(slug);
  const linked = current ? linkedGuideSlugs(current) : [];
  const ordered = [...linked.map(guideBySlug).filter((g): g is Guide => g !== null), ...GUIDES];
  return [...new Map(ordered.map((guide) => [guide.slug, guide])).values()]
    .filter((guide) => guide.slug !== slug)
    .slice(0, limit);
}
