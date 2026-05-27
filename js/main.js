document.addEventListener('DOMContentLoaded',function(){
  const posts = document.getElementById('posts');
  // 简单示例：可扩展为加载 JSON 或 API
  const sample = ['示例文章：站点已重建 - 2026-05-27'];
  posts.innerHTML = sample.map(s=>'<li>'+s+'</li>').join('');
});
