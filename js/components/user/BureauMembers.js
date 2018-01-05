import React from 'react'
import Relay from 'react-relay'
import {fromGlobalId} from 'graphql-relay';
import SearchLocation from './SearchLocation'
import EditMember from './EditMember'
import DeleteMemberMutation from '../mutation/DeleteMemberMutation'

class BureauMembers extends React.Component {


    constructor(props) {
        super(props);
    }


    handleClick(e) {

        e.preventDefault()

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

    handleEdit(e) {

        console.log('edit')
    }

    render() {

        let memberList = ''

        if(this.props.viewer.memberList) {
            memberList = this.props.viewer.memberList.edges.map(function (edge) {
                return (
                    <div key={fromGlobalId(edge.node.id).id} className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">{edge.node.role.name}</h4>
                            </div>
                            <div className="panel-body">
                                <h5>{edge.node.firstName} {edge.node.lastName}</h5>
                                <b>Nina</b> : {edge.node.nina} <br/><br/>
                                <b>Contact</b> : {edge.node.contact} <br/><br/>
                                <b>VFQ</b> : {edge.node.location.name} <br/>
                            </div>
                            <div className="panel-footer clearfix">
                                <div className="pull-right">
                                    <a href={"/#/member/" + edge.node.id}>
                                       <i className="fa fa-pencil" aria-hidden="true"></i>
                                   </a>
                                    &nbsp;&nbsp;&nbsp;
                                   <span style={{cursor:'pointer'}} data-id={edge.node.id} data-name={edge.node.name} onClick={this.handleClick.bind(this)} >
                                       <i className="fa fa-trash-o" aria-hidden="true"></i>
                                   </span>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    <i className="fa fa-3x fa-users"></i>
                    <h3>Aucun membre</h3>
                </div>
            )
        }

        return (
            <div className="">
                <div className="page-header col-md-12 center-block">
                    <br/>
                    <br/>
                </div>

                <div className="col-md-10 center-block">
                    <h4 className="text-center">Bureau : {this.props.viewer.bureau.name} &nbsp;
                        <small>
                            <a href={"/#/bureau/" + this.props.viewer.bureau.ref + "/edit"}>
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </a>
                        </small>
                    </h4>
                    <br/>
                    <br/>
                    {memberList}
                </div>
            </div>
        );
    }
}

BureauMembers.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(BureauMembers, {

    initialVariables: {bureauRef: ''},

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               id
               bureau(ref: $bureauRef) {
                  id
                  name
                  ref
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
                        ref
                      }
                      bureau {
                        name
                      }
                    }   
                  }
               }
               ${SearchLocation.getFragment('viewer', vars)}
               ${SearchLocation.getFragment('viewer', vars)}
               ${EditMember.getFragment('viewer', vars)}
          }
    `,
    }
});