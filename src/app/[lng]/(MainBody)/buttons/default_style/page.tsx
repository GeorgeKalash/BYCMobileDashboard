'use client';
import React from "react";
import SharedButton from "@/Shared/Components/SharedButton";

const DefaultStyle = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 10 }}> Shared Button Showcase</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: 30 }}>
        <SharedButton title="Primary" color="primary" onClick={() => console.log('hy')} />
        <SharedButton title="Outline Primary" color="primary" outline />
        <SharedButton title="Active Button" color="success" active />
        <SharedButton title="Disabled Button" color="secondary" disabled />
        <SharedButton title="Disabled Outline" color="danger" outline disabled />
        <SharedButton title="Large Button" color="primary" size="lg" />
        <SharedButton title="Small Button" color="primary" size="sm" />
        <SharedButton title="Rounded Shadow" color="info" className="rounded-pill shadow" />
        <SharedButton tooltip="This is Google" color="warning"  logo="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"/>
        <SharedButton tooltip="This is Microsoft" logo="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" />
        <SharedButton tooltip="This is Apple" logo="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" />
        <SharedButton tooltip="This is Amazon" logo="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"   />
        <SharedButton title="Hover Me" tooltip="Tooltip on a text button" color="info" />
      </div>

      <hr style={{ margin: '30px 0' }} />
    </div>
  );
};

export default DefaultStyle;
