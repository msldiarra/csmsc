import React from 'react'
import Relay from 'react-relay'
import AppMessage from '../common/AppMessage';
import SearchVFQ from './SearchVFQ'
import SearchRole from './SearchRole'
import AttachMedia from './AttachMedia'
import EditMemberMutation from '../mutation/EditMemberMutation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {fromGlobalId} from 'graphql-relay';
import _ from 'lodash';



class ModifyMember extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            members: {},
            locationId: '',
            locationRef: '',
            roleId: '',
            roleName: '',
            errorMessage: '',
            successMessage: ''
        } ;
    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref});
    }

    onRoleEnter(role) {
        this.setState({roleId: role.id, roleName: role.name});
    }

    onEditMember(e) {

        e.preventDefault();

        var editMemberMutation = new EditMemberMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            memberId: this.props.memberId,
            roleId: this.state.roleId,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            nina: this.refs.nina.value,
            contact: this.refs.contact.value,
            locationRef: this.state.locationRef,
        });

        var onSuccess = (response) =>  {

            this.setState({successMessage : "Enregistré avec succès !", loading: false},
                () => {
                    setTimeout(() => this.setState({successMessage : ""}), 4000)
                });
        }

        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(editMemberMutation, {onSuccess, onFailure})

    }


    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;
        const member = this.props.viewer.member;
        const communeRef = member.bureau.location.ref;

        const bureauName = member.bureau.name;
        const defaultRole = member.role;
        const defaultLocation = member.location
        const defaultFirstName = member.firstName
        const defaultLastName = member.lastName
        const defaultContact= member.contact
        const defaultNina= member.nina

        return (
            <div className="">
                <ReactCSSTransitionGroup transitionName="example" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={0} transitionLeaveTimeout={0}>
                    <div className="page-header col-md-6 center-block row">

                    </div>

                {errorMessage? <AppMessage message={errorMessage} /> : ''}
                {successMessage? <AppMessage message={successMessage} class="success"/> : ''}

                    <form className="form-horizontal padding-20" name="edit-bureau">
                        <div className="page-content row">

                            <div className="col-md-12 center-block" >
                                    <h4>
                                        Bureau {' '} {bureauName}
                                    </h4>
                            </div>
                            <br/>
                            <br/>

                            <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                                        <label className="opacity-87">Poste</label>
                                        <div className="input-group col-md-12 col-lg-12 col-xs-12 col-sm-12">
                                            <SearchRole {...this.props} defaultValue={defaultRole} onRoleEnter={this.onRoleEnter.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                                        <label className="opacity-87">VFQ</label>
                                        <SearchVFQ {...this.props} communeRef={communeRef} defaultValue={defaultLocation}  onLocationEnter={this.onLocationEnter.bind(this)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                                        <label className="opacity-87">Prénoms</label>
                                        <input type="text" ref="firstName" name="firstName" className="form-control" defaultValue={defaultFirstName} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 col-sm-12 center-block">
                                        <label className="opacity-87">Nom</label>
                                        <input type="text" ref="lastName" name="lastName"  className="form-control" defaultValue={defaultLastName} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 col-sm-12 center-block">
                                        <label className="opacity-87">Nina</label>
                                        <input type="text" ref="nina" name="nina" className="form-control" defaultValue={defaultNina}  />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                                        <label className="opacity-87">Contact</label>
                                        <input type="text" ref="contact" name="contact" className="form-control" defaultValue={defaultContact} />
                                    </div>
                                </div>


                                <div className="form-group">
                                    <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                        <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onEditMember.bind(this)} >
                                            {this.state.loading && <div className="text-center"><i className="fa fa-2x fa-spinner" /></div> }
                                            {!this.state.loading && <b>Enregistrer</b>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}


ModifyMember.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(ModifyMember, {

    initialVariables: {memberId: ''},

    prepareVariables: prevVariables => {

        return {
            ...prevVariables,
            memberId: parseInt(fromGlobalId(prevVariables.memberId).id)
        }
    },

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               id
               member(memberId: $memberId) {
                  firstName
                  lastName
                  nina
                  contact
                  location {
                    id
                    ref
                    name
                  }
                  role {
                    id
                    name
                  }
                  bureau {
                    ref
                    name
                    location {
                       id
                       ref
                       name
                    }
                  }
                  
               }
               ${SearchVFQ.getFragment('viewer', vars)}
               ${SearchRole.getFragment('viewer', vars)}
               ${EditMemberMutation.getFragment('viewer', vars)}
          }
    `,
    }
});
