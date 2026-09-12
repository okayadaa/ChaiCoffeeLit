import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: "invalidate-tags",
      event: {
        resource: {
          type: "dataset",
          id: "k3mh42a4.production",
        },
      },
    }),
  ],
});