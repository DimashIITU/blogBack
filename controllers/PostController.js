import PostModel from '../modules/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить тэги',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        user: req.userId,
      },
    );
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось  обновить статью',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Не удалось  удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }
        res.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось  получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: 'Не удалось  веруть статью',
          });
        }

        if (!doc) {
          return res.status(404).res.json({
            message: 'Статья не найдена',
          });
        }
        res.json(doc);
      },
    ).populate('user');
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось  получить статьи',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.set({
      'Content-Type': 'text/plain',
      'Content-Length': '123',
      ETag: '12345',
    });

    res.header('Access-Control-Allow-Origin', ['*']);
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось  получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    console.log(req.body.imageUrl);
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    x;
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};
