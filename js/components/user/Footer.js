import React from 'react';

export default class Footer extends React.Component {

    render() {


        let footer =
                <footer className={"container footer text-center"}>
                    <hr/>
                    <p className="headline"><span className={"blue-bold"}>Centre de Traitement des Données de l'Etat Civil</span></p>
                    <br/>
                    <img src={"/images/1.bmp"} width={"90px"} height={"90px"} />
                    <br/><br/>
                    <div className="headline">&copy;{" CTDEC 2017"} |  Korofina - Bamako, MALI</div>
                </footer>


        return footer;
    }
}
