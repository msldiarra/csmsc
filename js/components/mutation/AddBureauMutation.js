import Relay from 'react-relay';
import _ from 'lodash'


export default class AddBureauMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {addBureauMutation}`;
    }


    getVariables() {
        return {
            viewerId : this.props.viewerId,
            locationRef : this.props.locationRef,
            name : this.props.name,
            members : this.props.members,
            mediaNames : this.props.mediaNames,

        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on AddBureauPayload {
              bureauRef
              viewer
          }
    `;
    }

    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    viewer: this.props.viewer.id
                }
            },
            {
                type: 'REQUIRED_CHILDREN',
                children: [Relay.QL`
                      fragment on AddBureauPayload {
                          bureauRef,                         
                      }`
                ]
            },
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

