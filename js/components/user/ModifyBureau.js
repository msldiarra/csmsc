import React from 'react'
import Relay from 'react-relay'
import AppMessage from '../common/AppMessage';
import MemberEdit from './MemberEdit';
import SearchCommune from './SearchCommune'
import SearchVFQ from './SearchVFQ'
import MediaList from './MediaList'
import AttachMedia from './AttachMedia'
import NewMember from './NewMember'
import ModifyBureauMutation from '../mutation/ModifyBureauMutation'
import DeleteMediaMutation from '../mutation/DeleteMediaMutation'
import AttachMediaMutation from '../mutation/AttachMediaMutation'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';



class ModifyBureau extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mediaNames: [],
            locationId: '',
            locationName: '',
            locationRef: '',
            loading: false,
            mandatoryFieldsGiven: false,
            addMemberForm: false,
            vfqId: '',
            roleId: '',
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
        this.setState({addMemberForm: true}, () => console.log(this.refs.member))
    }

    onEditBureau(e) {

        e.preventDefault();

        if(!this.state.locationRef || !this.refs.bureau.value) {

            this.setState({errorMessage : "Veuiller remplir la commune et le nom du bureau"},
                () => {
                    setTimeout(() => this.setState({errorMessage : ""}), 4000)
                });
            return ;
        }

        let member = undefined

        if(this.state.addMemberForm) {

            const newMember = this.refs.member.refs.component

            member = {
                roleId: this.state.roleId,
                firstName: newMember.refs.firstName.value,
                lastName: newMember.refs.lastName.value,
                nina: newMember.refs.nina.value,
                contact: newMember.refs.contact.value,
                locationId: this.state.vfqId
            }
        }

        var modifyBureauMutation = new ModifyBureauMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            locationRef: this.state.locationRef,
            bureauId: this.props.viewer.bureau.id,
            ref: this.props.viewer.bureau.ref,
            name: this.refs.bureau.value,
            member: member,
            mediaNames: this.state.mediaNames,

        });

        var onSuccess = () =>  this.setState(
            {successMessage : "Enregistré avec succès !", loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            }
        );

        var onFailure = (transaction) => this.setState({errorMessage : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
            " Contactez l'administrateur", loading: false},
            () => {
                setTimeout(() => this.setState({errorMessage : ""}), 4000)
            });

        Relay.Store.commitUpdate(modifyBureauMutation, {onSuccess, onFailure})

    }

    onAddMember(member) { }

    onVFQEnter(location) {
        this.setState({vfqId: location.id});
    }

    onRoleEnter(role) {
        this.setState({roleId: role.id});
    }

    deleteMedia(mediaId, mediaName) {

        var deleteMediaMutation = new DeleteMediaMutation({
            viewer: this.props.viewer,
            viewerId: this.props.viewer.id,
            mediaId: mediaId,
            mediaName: mediaName
        });

        var onSuccess = () =>  this.setState(
            {successMessage : "Document supprimé!", loading: false},
            () => {
                setTimeout(() => this.setState({successMessage : ""}), 4000)
            }
        );

        var onFailure = (transaction) => this.setState({message : "Désolé, nous avons rencontré un problème lors de l'enregistrement." +
        " Contactez l'administrateur"});

        Relay.Store.commitUpdate(deleteMediaMutation, {onSuccess, onFailure})

    }

    onLocationEnter(location) {
        this.setState({locationId: location.id, locationName: location.name, locationRef: location.ref});
    }

    componentDidMount() {

        window.scrollTo(0, 0);
    }

    render() {

        const errorMessage = this.state.errorMessage;
        const successMessage = this.state.successMessage;

        let memberForm = <div id="memberForm"></div>;

        let defaultLocation = this.state.locationRef ? {id: this.state.locationId, ref: this.state.locationRef, name: this.state.locationName} : this.props.viewer.bureau.location;
        let defaultName = this.props.viewer.bureau.name;

        let media = this.props.viewer.bureau.media.edges;
        let mediaList = '';

        if(media && media.length > 0) {
            mediaList = <MediaList media={media} onDeleteMedia={this.deleteMedia.bind(this)}/>
        }

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
                {successMessage? <AppMessage message={successMessage} className="success"/> : ''}

                <form className="form-horizontal padding-20" name="add-property">
                    <div className="page-content row">

                        <div className="col-md-12 center-block">
                            <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                <h4>{this.props.viewer.bureau.name}
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
                                        <SearchCommune {...this.props} defaultValue={defaultLocation} onLocationEnter={this.onLocationEnter.bind(this)} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <label className="opacity-87">Bureau</label>
                                    <div className="input-group col-md-12">
                                        <span className="input-group-addon"></span>
                                        <input type="text" ref="bureau" id="bureau" className="form-control" placeholder="" defaultValue={defaultName} />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <label className="opacity-87">Documents</label>
                                    <AttachMedia viewer={this.props.viewer} onAddMedia={this.onAddMedia.bind(this)} onMediaInsert={this.onMediaInsert.bind(this)}/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <div className="dropdown">
                                        <button style={{width:'100%'}} className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                            <div style={{width:'100%'}} >
                                                <span style={{float:'left'}}>
                                                    Télécharger
                                                </span>
                                                <span style={{float:'right'}}>
                                                    <i className="fa fa-arrow-down"/>
                                                </span>
                                            </div>
                                        </button>
                                        {mediaList}
                                    </div>
                                </div>
                            </div>
                            {memberForm}
                            <div className="form-group">
                                <div className="col-md-6 col-lg-4 col-xs-12 col-sm-8 center-block">
                                    <button type="button" style={{width:'100%'}} className="btn btn-default" onClick={this.onEditBureau.bind(this)} >
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


ModifyBureau.contextTypes = {
    router: React.PropTypes.object.isRequired
}

export default Relay.createContainer(ModifyBureau, {

    initialVariables: {reference: ''},

    fragments: {
        viewer: (vars) => Relay.QL`
          fragment on Viewer {
               id
               bureau(ref: $reference) {
                  id
                  ref
                  name
                  location {
                       id
                       ref
                       name
                  }
                  media(first: 5){
                    edges {
                        node {
                          id
                          uri
                          name
                          mime_type
                        }   
                    }
                  }
               } 
               ${MemberEdit.getFragment('viewer', vars)}
               ${SearchVFQ.getFragment('viewer', vars)}
               ${SearchCommune.getFragment('viewer', vars)}
               ${ModifyBureauMutation.getFragment('viewer', vars)}
               ${AttachMediaMutation.getFragment('viewer', vars)}
               ${DeleteMediaMutation.getFragment('viewer', vars)}
               ${NewMember.getFragment('viewer', vars)}
          }
    `,
    }
});
