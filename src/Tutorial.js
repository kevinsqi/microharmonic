import React from 'react';

function Tutorial(props) {
  // TODO: swap in photos with own illustrations
  // TODO: show weird physical microtone keyboards
  return (
    <div className="container my5">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-lg-8 offset-lg-2">
          <h1 className="text-muted">01. An introduction to microtones</h1>
          <h2 className="h4 font-weight-bold mt4">What’s common to practically all contemporary music?</h2>
          <div className="w-50 py-3">
            <img
              className="w-100"
              src="http://www.agnes-bruckner.com/apronus_images/facepiano.gif"
              alt="piano keyboard"
            />
          </div>
          <p>
            You might know of them as C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, and B.
            From these 12 notes we can play pretty much any song that we know of.
            You can try it out with a 12EDO keyboard here.
          </p>
          <p>
            The "distance", or "interval", between any two notes is the same in 12EDO.
          </p>
          <p>
            But you can make many more sounds than just these 12 notes.
            Just use your voice to hum from C to D and you’ve produced a
            continuous spectrum of frequencies that aren't in 12EDO.
            And it’s not just voice. Here are some other instruments that can
            traverse between notes:
          </p>
          <div className="row my-3">
            <div className="col-3">
              <img
                src="https://static1.squarespace.com/static/57d2f09a6b8f5b98b30057f4/t/58cb1879414fb534eec71f43/1492026344786/"
                className="w-100"
              />
            </div>
            <div className="col-2">
              <img
                src="https://images-na.ssl-images-amazon.com/images/I/61NJglqoJVL._SL1500_.jpg"
                className="w-100"
              />
            </div>
            <div className="col-3">
              <img
                src="http://media.guitarcenter.com/is/image/MMGS7/Prelude-Series-Violin-Outfit-1-8-Size/J05662000001000-00-500x500.jpg"
                className="w-100"
              />
            </div>
          </div>
          <p>
            Microtones refer to the use of intervals that don’t fit within this
            ubiquitous 12 tone structure.
            Listen to this microtonal song:
          </p>
          <div className="w-50">
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameborder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/146753233&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
            >
            </iframe>
          </div>
          <p>
            The composer notes that this was written in 19EDO.
            You can play around with 19EDO here.
            {/* TODO: use Composer to actually transcribe The Juggler */}
          </p>
          <p>
            Microtonal music can also sound quite strange and wonderful.
            This song by Sevish uses a 53EDO scale:
          </p>
          <div className="w-50">
            <iframe
              width="100%"
              height="150"
              scrolling="no"
              frameborder="no"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/212652160&amp;color=%23b89890&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true&amp;visual=true"
            >
            </iframe>
          </div>
          <h2 className="h4 font-weight-bold mt4">Frequencies and cents</h2>
          <p>
            Our perception of sound is on a logarithmic scale relative to frequency. An octave, from C to C or D to D or so on, is when you double the frequency.
            Middle C is 440hz. Go up an octave to 880hz.
            Being logarithmic isn’t super convenient relative to our perception, which is linear. So we can use cents instead, which is defined as:
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
