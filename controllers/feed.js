exports.getPosts = (req, res, next) => {
  res.status(200).json({posts: [{name: "testName", value: "testValue"}]});
}

exports.postPosts = (req, res, next) => {
  console.log(req.body);
  const title = req.body.title;
  const content = req.body.content

  res.status(201).json({status: "success",
    date: new Date().toISOString(),
    postData: {title: title, content: content}});
}