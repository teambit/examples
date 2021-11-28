import gql from 'graphql-tag';
import { BuilderMain } from '@teambit/builder';
import { Component } from '@teambit/component';
import { AspectLocStatsAspect } from './aspect-loc-stats.aspect';

export function locStatsSchema(builder: BuilderMain): any {
  return {
    typeDefs: gql`
      type LOC {
        total: Int
        source: Int
        comment: Int
        single: Int
        block: Int
        mixed: Int
        empty: Int
        todo: Int
        blockEmpty: Int
      }

      extend type Component {
        # Get latest line-of-code stats for this component
        locStats: LOC
      }
    `,
    resolvers: {
      Component: {
        locStats: async (component: Component) => {
          const artifactVinyl = await builder.getArtifactsVinylByExtension(
            component,
            AspectLocStatsAspect.id
          );

          const output = JSON.parse(
            artifactVinyl[0].toReadableString().content
          );

          const {
            total,
            source,
            comment,
            single,
            block,
            mixed,
            empty,
            todo,
            blockEmpty,
          } = output;
          return {
            total,
            source,
            comment,
            single,
            block,
            mixed,
            empty,
            todo,
            blockEmpty,
          };
        },
      },
    },
  };
}
