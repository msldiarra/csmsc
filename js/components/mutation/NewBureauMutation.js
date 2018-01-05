import Relay from 'react-relay';
import _ from 'lodash'


export default class NewBureauMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {newBureauMutation}`;
    }


    getVariables() {
        return {
            viewerId : this.props.viewerId,
            locationRef : this.props.locationRef,
            bureauRef : this.props.bureauRef,
            name : this.props.name,
            member : this.props.member,
            mediaNames : this.props.mediaNames,

        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on NewBureauPayload {
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
                      fragment on NewBureauPayload {
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

