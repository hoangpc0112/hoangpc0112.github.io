export const PROJECTS = Object.freeze([
  {name:'packet-analyzer',category:'security'}, {name:'library-management',category:'web'},
  {name:'ble-mesh-chat',category:'security'}, {name:'movie-ticket-booking',category:'web'},
  {name:'bookmark-manager',category:'tools'}, {name:'dotfiles',category:'tools'}
]);
export function selectProjects(category) {
  return PROJECTS.filter(project => category === 'all' || project.category === category);
}
export function replyFor(raw,language='vi') {
  const command = String(raw).trim().toLowerCase();
  const replies = {
    help: 'Các lệnh có sẵn:\nwhoami    Giới thiệu bản thân\nprojects  Danh sách dự án\nskills    Công nghệ đang dùng\ncontact   Email và GitHub\nclear     Xóa màn hình\n\nDùng ↑ / ↓ để xem lịch sử lệnh.',
    whoami: 'Phạm Chính Hoàng / HoangPC\nSinh viên An toàn thông tin @ PTIT\nHà Nội, Việt Nam\nĐang học: AI & ML, JLPT N3\nBio: TLE enjoyer',
    projects: PROJECTS.map((p,i) => `${String(i+1).padStart(2,'0')}  ${p.name}`).join('\n') + '\n\nMỗi dự án có liên kết mã nguồn ở phần Dự án.',
    skills: 'C / C++ · Java · Python · JavaScript · TypeScript\nReact · FastAPI · Spring Boot\nPostgreSQL · MySQL · SQLite\nLinux · Git · Hyprland',
    contact: 'Email: phamchinhhoang@gmail.com\nGitHub: https://github.com/hoangpc0112',
    clear: ''
  };
  if(language==='en')Object.assign(replies,{
    help:'Available commands:\nwhoami    About me\nprojects  Project list\nskills    Technologies\ncontact   Email and GitHub\nclear     Clear terminal\n\nUse ↑ / ↓ for command history.',
    whoami:'Phạm Chính Hoàng / HoangPC\nCybersecurity student @ PTIT\nHanoi, Vietnam\nLearning: AI & ML, JLPT N3\nBio: TLE enjoyer',
    projects:PROJECTS.map((p,i)=>`${String(i+1).padStart(2,'0')}  ${p.name}`).join('\n')+'\n\nSource links are available in the Projects section.'
  });
  return Object.hasOwn(replies,command) ? {command,text:replies[command],clear:command==='clear'} : {command,text:language==='en'?`Unknown command “${String(raw).trim()}”. Type help for the list.`:`Không có lệnh “${String(raw).trim()}”. Gõ help để xem danh sách.`,clear:false};
}
