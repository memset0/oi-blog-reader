function load(id) {
  console.log('load', id)
  NProgress.start()
  axios.post('/reader/post', {
      id: id
    })
    .then((res) => {
      console.log(res.data)
      $('#postTitle').text(res.data.title)
      $('#postContent').html(res.data.content)
      history.pushState({}, '', `/reader/${res.data.id}`)
      renderLatex()
      NProgress.done()
    });
}