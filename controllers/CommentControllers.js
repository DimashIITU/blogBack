import CommentModel from '../modules/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = CommentModel.find();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить комментарий',
    });
  }
};

export const getLastComments = async (req, res) => {
  try {
    const comments = CommentModel.find().limit(5).exec();
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось получить комментарий',
    });
  }
};

export const postComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      comment: req.body.comment,
      user: req.userId,
    });

    const comment = await doc.save();

    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: ' Не удалось добавить комментарий',
    });
  }
};
