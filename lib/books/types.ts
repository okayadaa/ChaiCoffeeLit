export type Book = {
    _id: string
    title: string
    author?: string
    coverImage: {
      _type: 'image'
      asset: {
        _type: 'reference'
        _ref: string
      }
    }
    recommendedAt: string
  }