export type Participant = {
    _id: string;
    name: string;
    role: string;
    bio: string;
    image: {
      asset: {
        _ref: string;
        _type: "reference";
      };
    };
    order: number;
  };