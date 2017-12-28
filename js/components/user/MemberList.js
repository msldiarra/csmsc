import React from 'react'
import Relay from 'react-relay'
import SearchLocation from './SearchLocation'

class MemberList extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {

        let memberList = ''



        if(this.props.viewer.memberList) {
            memberList = this.props.viewer.memberList.edges.map(function (edge) {
                return (
                    <tr key={edge.node.id}>
                        <th className="role">{edge.node.role.name}</th>
                        <td>{edge.node.firstName} {edge.node.lastName}</td>
                        <td>{edge.node.nina}</td>
                        <td>{edge.node.contact}</td>
                        <td>{edge.node.location.name}</td>
                    </tr>
                )
            }.bind(this));
        }



        if(memberList === "" || memberList.length === 0) {
            memberList = (
                <div className="col-md-12 center-block text-center opacity-54">
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <i className="fa fa-3x fa-users"></i>
                    <h3>Aucun membre</h3>
                </div>
            )
        } else {


            memberList = <div className="panel panel-default">
                <table className="table table-bordered table-condensed u">
                    <thead className="">
                    <tr>
                        <th>Poste</th>
                        <th>Nom</th>
                        <th>NINA</th>
                        <th>Contact</th>
                        <th>VFQ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {memberList}
                    </tbody>
                </table>
            </div>

        }


        return (
            <div className="container">
                <div className="page-header col-md-12 center-block">
                    <br/>
                    <br/>
                </div>

                <div className="col-md-10 center-block">
                    <h3 className="text-center">Liste des membres du bureau : <b>{this.props.viewer.bureau.name}</b></h3>
                    <br/>
                    <br/>
                    <br/>

                    {memberList}

                </div>

            </div>
        );
    }
}

MemberList.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(MemberList, {

    initialVariables: {bureauRef: ''},

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               bureau(ref: $bureauRef) {
                  id
                  name
               },
               memberList(bureauRef: $bureauRef, first:100) {
                  edges {
                    node {
                      id
                      firstName
                      lastName
                      nina
                      contact
                      role {
                        name
                      }
                      location {
                        name
                      }
                      bureau {
                        name
                      }
                    }   
                  }
               }
               ${SearchLocation.getFragment('viewer', vars)}
          }
    `,
    }
});