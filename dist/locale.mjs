import {replyFor} from './portfolio-core.mjs';

const english=new Map(Object.entries({
  'Bỏ qua điều hướng':'Skip navigation', 'Giới thiệu':'About', 'Dự án':'Projects',
  'Sinh viên An toàn thông tin tại PTIT. Tôi viết phần mềm, tìm hiểu mạng máy tính và xây những công cụ mình muốn sử dụng.':'Cybersecurity student at PTIT. I write software, explore computer networks, and build tools I want to use.',
  'Xem dự án':'View projects', 'Mở GitHub ↗':'Open GitHub ↗',
  'Hà Nội, Việt Nam':'Hanoi, Vietnam', 'Hà Nội · Việt Nam':'Hanoi · Vietnam',
  '22 repo công khai':'22 public repositories', 'GitHub từ 2023':'On GitHub since 2023',
  'Cuộn để khám phá':'Scroll to explore', 'Từ dòng lệnh':'From commands', 'đến':'to', 'ý tưởng.':'ideas.',
  'Tôi theo học ngành An toàn thông tin tại Học viện Công nghệ Bưu chính Viễn thông (PTIT).':'I study Cybersecurity at the Posts and Telecommunications Institute of Technology (PTIT).',
  'GitHub của tôi là nơi lưu những bài tập, ứng dụng web và thử nghiệm về mạng. Từ phân tích PCAP, chat qua BLE đến hệ thống gợi ý sách.':'My GitHub holds coursework, web applications, and networking experiments. From PCAP analysis and BLE chat to book recommendations.',
  'v1.0 / portfolio terminal':'v1.0 / portfolio terminal',
  'Gõ':'Type', 'để xem lệnh. Thử':'to see commands. Try', 'hoặc':'or',
  'Nhập lệnh portfolio':'Enter a portfolio command',
  'Terminal mô phỏng, có các lệnh help, whoami, projects, skills, contact và clear. Không chạy lệnh trên máy.':'Simulated terminal. Commands: help, whoami, projects, skills, contact, and clear. No commands run on your computer.',
  'Code có':'Code with', 'câu chuyện.':'stories.', 'Toàn bộ repositories':'All repositories',
  'Tất cả':'All', 'Mạng & bảo mật':'Network & security', 'Linux & công cụ':'Linux & tools',
  '06 dự án':'06 projects', 'Đọc những gì':'Read what', 'mạng đang nói.':'networks say.',
  'Thu thập gói tin, phân tích PCAP, phát hiện DNS bất thường và dữ liệu nhạy cảm truyền rõ.':'Capture packets, analyze PCAP files, and detect unusual DNS activity and sensitive data sent in plaintext.',
  'Xem mã nguồn':'View source', 'Thư viện có':'A library with', 'gợi ý sách.':'book recommendations.',
  'Quản lý sách, bạn đọc và mượn trả. Gợi ý cá nhân hóa bằng k-NN và cosine similarity.':'Manage books, readers, and loans. Personalized recommendations using k-NN and cosine similarity.',
  'Chat Bluetooth':'Bluetooth chat', 'không Internet.':'without Internet.',
  'Chat Android qua Bluetooth LE. Nhắn riêng, kênh công khai và hàng đợi tin nhắn lưu trong SQLite.':'Android chat over Bluetooth LE. Private messages, public channels, and a message queue stored in SQLite.',
  'Ứng dụng &':'Apps &', 'công cụ.':'tools.', 'Đặt vé':'Book tickets', 'theo suất chiếu.':'by showtime.',
  'Đặt vé theo suất chiếu, chọn ghế, xác thực OTP qua email và quản lý lịch sử đặt vé.':'Book by showtime, choose seats, verify email OTPs, and manage booking history.',
  'Bookmark gọn,':'Organized bookmarks,', 'tìm kiếm nhanh.':'faster search.',
  'Extension trình duyệt để duyệt, tìm kiếm và quản lý bookmark qua một giao diện tập trung.':'A browser extension to browse, search, and manage bookmarks in one place.',
  'Môi trường làm việc':'A workspace', 'theo cách riêng.':'on my terms.',
  'Cấu hình Arch Linux và Hyprland cho máy cá nhân, kết hợp và tùy biến từ nhiều nguồn.':'Personal Arch Linux and Hyprland configuration, combining and adapting work from multiple sources.',
  'Công cụ để':'Tools to', 'biến ý tưởng thành code.':'turn ideas into code.',
  'Về đầu trang ↑':'Back to top ↑',
  'HoangPC — Trang đầu':'HoangPC — Home', 'Điều hướng chính':'Main navigation',
  'Mở menu':'Open menu', 'Chạy lệnh':'Run command', 'Lọc dự án':'Filter projects', 'Công nghệ':'Technologies',
  'Khối cầu mạng ASCII xoay, gồm các điểm và quỹ đạo xanh phosphor':'Rotating ASCII network sphere with phosphor-green points and orbital rings',
  'Đồ họa giao thức TCP, DNS, HTTP và phân tích PCAP của NetScope':'NetScope illustration of TCP, DNS, HTTP, and PCAP analysis',
  'Đồ họa sách và hệ thống gợi ý bằng kNN':'Books and k-NN recommendation system illustration',
  'Sơ đồ các nút Bluetooth kết nối với nhau':'Diagram of connected Bluetooth nodes',
  'Sơ đồ ghế rạp minh họa chức năng chọn ghế':'Cinema seating diagram illustrating seat selection',
  'Bookmark Manager: ô tìm kiếm và các thư mục bookmark':'Bookmark Manager: search field and bookmark folders',
  'Terminal cấu hình Arch Linux và Hyprland':'Arch Linux and Hyprland configuration terminal',
  'Phạm Chính Hoàng, sinh viên An toàn thông tin tại PTIT. Portfolio dự án mạng, bảo mật, web và công cụ Linux từ GitHub hoangpc0112.':'Phạm Chính Hoàng, Cybersecurity student at PTIT. Networking, security, web, and Linux projects from GitHub hoangpc0112.',
  'Từ phân tích gói tin đến ứng dụng web. Những dự án của Phạm Chính Hoàng.':'From packet analysis to web applications. Projects by Phạm Chính Hoàng.'
}));

export let language='vi';
export const projectCount=count=>`${String(count).padStart(2,'0')} ${language==='en'?'projects':'dự án'}`;

export function initLanguage(){
  const button=document.querySelector('#language-toggle');
  const records=[];
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
    const node=walker.currentNode;
    if(node.parentElement.closest('script,style,#language-toggle,#filter-count'))continue;
    const source=node.textContent,trimmed=source.trim();
    const translated=english.get(trimmed) ?? (trimmed.includes('"location"')?trimmed.replace('Hà Nội, Việt Nam','Hanoi, Vietnam'):null);
    if(translated)records.push({node,vi:source,en:source.replace(trimmed,translated)});
  }
  const attributes=[];
  for(const element of document.querySelectorAll('[aria-label],[alt],meta[name="description"],meta[property="og:description"]')){
    for(const name of ['aria-label','alt','content']){
      const vi=element.getAttribute(name),en=english.get(vi);
      if(en)attributes.push({element,name,vi,en});
    }
  }
  const apply=next=>{
    language=next==='en'?'en':'vi';
    document.documentElement.lang=language;
    for(const record of records)if(record.node.isConnected)record.node.textContent=record[language];
    for(const record of attributes)record.element.setAttribute(record.name,record[language]);
    for(const line of document.querySelectorAll('.terminal-line[data-raw]'))line.lastElementChild.textContent=replyFor(line.dataset.raw,language).text;
    document.querySelector('#filter-count').textContent=projectCount(document.querySelectorAll('[data-repo]:not([hidden])').length);
    button.textContent=language==='vi'?'EN':'VI';
    button.lang=language==='vi'?'en':'vi';
    button.setAttribute('aria-label',language==='vi'?'Switch to English':'Chuyển sang tiếng Việt');
    try{localStorage.setItem('portfolio-language',language);}catch{}
    document.dispatchEvent(new Event('languagechange'));
  };
  let saved='vi';try{saved=localStorage.getItem('portfolio-language');}catch{}
  apply(saved);
  button.addEventListener('click',()=>apply(language==='vi'?'en':'vi'));
}
