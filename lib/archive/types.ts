export type ArchiveItem = {
    _id: string;
    title: string;
    image: {
      asset?: {
        _ref: string;
        _type: "reference";
      };
    };
    description: string;
    eventDate: string;
  };