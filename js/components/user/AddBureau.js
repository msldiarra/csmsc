import React from 'react'
import Relay from 'react-relay'
import AppMessage from '../common/AppMessage';
import MemberEdit from './MemberEdit';
import SearchCommune from './SearchCommune'
import SearchVFQ from './SearchVFQ'
import SearchRole from './SearchRole'
import NewMember from './NewMember'
import AttachMedia from './AttachMedia'
import ReactDOM from 'react-dom'
import NewBureauMutation from '../mutation/NewBureauMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import _ from 'lodash';


class AddBureau extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaNames: [],
            locationName: '',
            locationRef: '',
            vfqId: '',
            roleId: '',
            loading: false,
            mandatoryFieldsGiven: false,
            addMemberForm: false,
            bureauRef: '',
            member: {},
            errorMessage: '',
            successMessage: ''
        } ;
    }

    onAddMedia(mediaNames) {
        var names = this.state.mediaNames;
        names.push(mediaNames);
        this.setState({mediaNames: names});
    }

    onMediaInsert(file, uri) {

        var onSuccess = (response) => this.setState({message: "Nouveau document ajouté avec succes!"});
        var onFailure = (transaction) => this.setState({message: transaction});

        Relay.Store.commitUpdate(
            new AttachMediaMutation({
                viewer: this.props.viewer,
                viewerId: this.props.viewer.id,
                uri: uri,
                name: file.name,
                file: file
            }, {onSuccess, onFailure})
        );
    }

    onAddMemberForm() {
        this.setState({addMemberForm: true})
    }

    onAddMember(member) {

    }

    onCreateBureau(e) {

        e.preventDefault();


        if(!this.state.locationRef || !this.refs.bureau.value) {

            this.setState({errorMessage : "Veuiller remplir la commune et le nom du bureau"},
                () => {
                    setTimeout(() => this.setState({errorMessage : ""}), 4000)
                });
            return ;
        }

        const newMember = this.refs.member.refs.component

        const member = {
            roleId: this.state.roleId,
            firstName: newMember.refs.firstName.value,
            lastName: newMember.refs.lastName.value,
            nina:newMember.refs.nina.value,
            contact: newMember.refs.contact.value,
            locationId: this.state.vfqId
        }

        var newBureauMutation = new NewBureauMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            locationRef: this.state.locationRef,
            bureauRef: this.state.bureauRef,
            name: this.refs.bureau.value,
            mediaNames: this.state.mediaNames,
            member: member
        });


        var onSuccess = (response) => this.setState({
                bureauRef: response.newBureauMutation.bureauRef,
                successMessage: "Nouveau Bureau ajouté !",
                loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            });


        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(newBureauMutation, {onSuccess, onFailure})

    }

    onLocationEnter(location) {
        this.setState({locationName: location.name, locationRef: location.ref});
    }

    onVFQEnter(location) {
        this.setState({vfqId: location.id});
    }

    onRoleEnter(role) {
        this.setState({roleId: role.id});
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;
        let memberForm = <div id="memberForm"></div>;


        if(this.state.addMemberForm) {
            memberForm = <NewMember ref="member" viewer={this.props.viewer} communeRef={this.state.locationRef}
                                    onAddMember={this.onAddMember.bind(this)}
                                    onRoleEnter={this.onRoleEnter.bind(this)}
                                    onVFQEnter={this.onVFQEnter.bind(this)}
            />
        }

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
                            <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                <h4>
                                    Nouveau bureau {'  '}
                                    <div onClick={this.onAddMemberForm.bind(this)} style={{float: 'right', cursor: 'pointer'}}>
                                        <i className="fa fa-user-plus opacity-54" />
                                    </div>
                                </h4>
                            </div>
                        </div>
                        <br/>
                        <br/>

                        <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 center-block">
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <label className="opacity-87">Commune</label>
                                    <div className="input-group col-md-12 col-lg-12 col-xs-12 col-sm-12">
                                        <SearchCommune {...this.props}  onLocationEnter={this.onLocationEnter.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <label className="opacity-87">Bureau</label>
                                    <div className="input-group col-md-12 col-lg-12 col-xs-12 col-sm-12">
                                        <span className="input-group-addon"></span>
                                        <input type="text" ref="bureau" id="bureau" className="form-control" placeholder="" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <label className="opacity-87">Document</label>
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                            </div>
                            {memberForm}
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onCreateBureau.bind(this)} >
                                        {this.state.loading && <div className="text-center"><i className="fa fa-2x fa-spinner" /></div> }
                                        {!this.state.loading && <b>Enregistrer le bureau</b>}
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


AddBureau.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(AddBureau, {

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               id
               roles {
                  id
                  name
               } 
               ${MemberEdit.getFragment('viewer', vars)}
               ${SearchCommune.getFragment('viewer', vars)}
               ${NewMember.getFragment('viewer', vars)}
               ${SearchVFQ.getFragment('viewer', vars)}
               ${NewBureauMutation.getFragment('viewer', vars)}
               ${AttachMediaMutation.getFragment('viewer', vars)}
               ${SearchRole.getFragment('viewer', vars)}
          }
    `,
    }
});
