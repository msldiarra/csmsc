import Relay from 'react-relay';

export default class DeleteMemberMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {deleteMemberMutation}`;
    }

    getVariables() {
        return {
            viewerId: this.props.viewerId,
            memberId: this.props.memberId
        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on DeleteMemberPayload {
              deletedMemberId
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
                connectionName: '',
                deletedIDFieldName: 'deletedMemberId',
                pathToConnection: ['viewer', 'memberList']
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
