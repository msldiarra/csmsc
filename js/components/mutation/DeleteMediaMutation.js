import Relay from 'react-relay';

export default class DeleteMediaMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {deleteMediaMutation}`;
    }

    getVariables() {
        return {
            viewerId: this.props.viewerId,
            mediaId: this.props.mediaId,
            mediaName: this.props.mediaName,
        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on DeleteMediaPayload {
              deletedMediaId
              viewer
          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'RANGE_DELETE',
                parentName: 'viewer',
                parentID: this.props.viewer.id,
                connectionName: 'properties',
                deletedIDFieldName: 'deletedMediaId',
                pathToConnection: ['viewer', 'bureau', 'media']
            }
        ]
    }

    static fragments = {
        viewer: () => Relay.QL`
          fragment on Viewer {
            id
          }
    `,
    };

    getOptimisticResponse() {

        return {
            viewer: {
                id: this.props.viewer.id,
            }
        };
    }
}
