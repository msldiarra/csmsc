import React from 'react'
import Relay from 'react-relay'
import SearchLocation from './SearchLocation'
import DeleteMemberMutation from '../mutation/DeleteMemberMutation'

class MemberList extends React.Component {


    constructor(props) {
        super(props);
    }


    handleClick(e) {

        e.preventDefault()

        console.log(this.props)

        const id = e.target.parentNode.getAttribute('data-id');

        var deleteMemberMutation = new DeleteMemberMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            memberId: id
        });

        var onSuccess = () =>  this.setState(
            {successMessage : "Membre supprimé!", loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            }
        );

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(deleteMemberMutation, {onSuccess, onFailure})

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
                        <td>
                            <span className="opacity-54" data-id={edge.node.id} data-name={edge.node.name} onClick={this.handleClick.bind(this)} >
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </span>
                        </td>
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
                        <th></th>
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
               id
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
               ${DeleteMemberMutation.getFragment('viewer', vars)}
          }
    `,
    }
});