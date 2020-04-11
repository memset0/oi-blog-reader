function load(id) {
  console.log('load', id);
  axios.post('/reader/post', {
      id: id
    })
    .then((res) => {
      console.log(res.data)
      $('#postTitle').text(res.data.title)
      $('#postContent').html(res.data.content)
      renderLatex()
    });
}