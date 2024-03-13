import React, {useState, useEffect} from 'react';

import Toast from 'react-bootstrap/Toast';
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import Card from 'react-bootstrap/Card';
import Moment from 'moment';

import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import placeholder from './img/placeholder.jpg';

const Rant = ({input}) => {
  const [rant, setRant] = useState({
    picture: input.profile_pic_url ? input.profile_pic_url : placeholder,
    username: input.username,
    amount: input.amount_dollars,
    date: input.created_on,
    text: input.text,
    copied: false
  });
  const copy_text = `${rant.username} $${rant.amount}: ${rant.text}`

  const handleClose = () => {
    setRant({
      ...rant,
      copied: !rant.copied
    })
    navigator.clipboard.writeText(copy_text)
  }

  return (
    <Toast className={rant.copied ? "faded" : ""}
           onClose={handleClose}
           key={rant.date}>
      <Toast.Header>
        <img src={rant.picture} className="rounded me-2" alt=""/>
        <strong className="me-auto">{rant.username} ${rant.amount}</strong>
        <small>{Moment(rant.date).format('HH:mm')}</small>
      </Toast.Header>
      <Toast.Body>{rant.text}</Toast.Body>
    </Toast>
  );

};

const App = () => {
  const [rants, setRants] = useState([])
  const [title, setTitle] = useState("No Livestream Found")
  const [likes, setLikes] = useState(0)
  const [watching, setWatching] = useState(0)

  const getData = async () => {
    await fetch("/api/rants")
      .then(response => response.json())
      .then(livestream => {
        if (livestream.status === 200) {
          setRants(livestream.rants)
          setTitle(livestream.title)
          setLikes(livestream.likes)
          setWatching(livestream.watching)
        } else {
          console.log(livestream)
        }
      });
  }

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="p-3">
      <Container className="col-lg-8 p-5 mb-4 bg-light rounded-3">
        <Container className="row">
          <h1 className="header" key="header">Rumble Metrics</h1>
          <h2 className="header" key="subheader">{title}</h2>
          <Card className="col-lg-6" bg={"info"}>
            <Card.Body>
              <i className="bi bi-eye"></i> {watching}
            </Card.Body>
          </Card>
          <Card className="col-lg-6" bg={"info"}>
            <Card.Body>
              <i className="bi bi-hand-thumbs-up"></i> {likes}
            </Card.Body>
          </Card>
        </Container>
        <Container className="row p-2">
          <Stack className="rantstack flex-column-reverse" gap={2}>
            {rants.map((rant, index) => (
              <Rant key={index} input={rant}/>
            ))}
          </Stack>
        </Container>
      </Container>
    </Container>
  );
};

export default App;
