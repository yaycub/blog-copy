const Post = require('./Post');

describe('Post model', () => {
  it('requires title', () => {
    const post = new Post();
    const { errors } = post.validateSync();

    expect(errors.title.message).toEqual('Path `title` is required.');
  });

  it('requires content', () => {
    const post = new Post();
    const { errors } = post.validateSync();

    expect(errors.content.message).toEqual('Path `content` is required.');
  });

  it('requires a category', () =>{
    const post = new Post();
    const { errors } = post.validateSync();

    expect(errors.category.message).toEqual('Path `category` is required.');
  });

  it('requires a category to follow enum', () =>{
    const post = new Post({ category: 'funny' });
    const { errors } = post.validateSync();

    expect(errors.category.message).toEqual('`funny` is not a valid enum value for path `category`.');
  });
});
