import Relay from 'react-relay';
import _ from 'lodash'


export default class ModifyBureauMutation extends Relay.Mutation {

    getMutation() {
        return Relay.QL`mutation {modifyBureauMutation}`;
    }


    getVariables() {
        return {
            viewerId : this.props.viewerId,
            locationRef : this.props.locationRef,
            bureauId : this.props.bureauId,
            ref : this.props.ref,
            name : this.props.name,
            member : this.props.member,
            mediaNames : this.props.mediaNames,

        };
    }

    getFatQuery() {
        return Relay.QL`
          fragment on ModifyBureauPayload {
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
            },
        };
    }
}

