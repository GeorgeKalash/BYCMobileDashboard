"use client";
import React, { useState } from "react";
import SharedButton from "@/Shared/Components/SharedButton";
import {
  SharedCheckbox,
  SharedCheckboxGroup,
  VariationCheckbox,
} from "@/Shared/Components/SharedCheckbox";
import {
  SharedRadioButton,
  SharedRadioGroup,
  VariationRadio,
} from "@/Shared/Components/SharedRadioButton";
import { SharedSwitch } from "@/Shared/Components/SharedSwitch";

const SamplePage = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [selectedGender, setSelectedGender] = useState("female");

  return (
    <div style={{ padding: 20 }}>
      <h2>Shared Components Showcase</h2>

      {/* Buttons Section */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: 30,
        }}
      >
        {/* Color Variants */}
        <SharedButton title="Primary" color="primary" />
        <SharedButton title="Secondary" color="secondary" />
        <SharedButton title="Success" color="success" />
        <SharedButton title="Danger" color="danger" />
        <SharedButton title="Warning" color="warning" />
        <SharedButton title="Info" color="info" />
        <SharedButton title="Light" color="light" />
        <SharedButton title="Dark" color="dark" />

        {/* Outline Buttons */}
        <SharedButton title="Outline Primary" color="primary" outline />
        <SharedButton title="Outline Danger" color="danger" outline />

        {/* Active / Disabled States */}
        <SharedButton title="Active Button" color="success" active />
        <SharedButton title="Disabled" color="secondary" disabled />
        <SharedButton
          title="Disabled Outline"
          color="danger"
          outline
          disabled
        />

        {/* Size Variants */}
        <SharedButton title="Large Button" color="primary" size="lg" />
        <SharedButton title="Small Button" color="primary" size="sm" />

        {/* Custom Class */}
        <SharedButton
          title="Rounded Shadow"
          color="info"
          className="rounded-pill shadow"
        />

        {/* With Tooltip & Logo */}
        <SharedButton
          tooltip="Google"
          color="warning"
          logo="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"
        />
        <SharedButton
          tooltip="Microsoft"
          logo="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
        />
        <SharedButton
          tooltip="Apple"
          logo="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
        />
        <SharedButton
          tooltip="Amazon"
          logo="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
        />
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Checkboxes Section */}
      <div style={{ padding: "0 10px" }}>
        <h4>SharedCheckbox Test Cases</h4>

        <SharedCheckbox
          label="Subscribe to Newsletter"
          checked={isSubscribed}
          onChange={setIsSubscribed}
        />
        <SharedCheckbox label="Disabled (Unchecked)" checked={false} disabled />
        <SharedCheckbox label="Disabled (Checked)" checked disabled />

        <hr />

        <SharedCheckboxGroup
          options={[
            { label: "Email", value: "email" },
            { label: "SMS", value: "sms" },
            { label: "Push Notification", value: "push" },
          ]}
          selectedValues={["email", "sms"]}
          onChange={(vals) => console.log(vals)}
        />
        <hr />
        <VariationCheckbox
          data={[
            { id: 1, color: "success", labelText: "Reading" },
            { id: 2, color: "success", labelText: "Watching TV", check: true },
            { id: 3, color: "danger", labelText: "Listening to music" },
            { id: 4, color: "danger", labelText: "Playing video games" },
            { id: 5, color: "success", labelText: "Painting/Drawing" },
          ]}
        />
      </div>

      <hr />

      {/* Radios Section */}
      <div style={{ padding: "0 10px" }}>
        <h4>SharedRadioButton Test Cases</h4>

        <SharedRadioButton
          label="Option 1"
          name="group1"
          value="option1"
          selectedValue={selectedOption}
          onChange={setSelectedOption}
        />
        <SharedRadioButton
          label="Option 2"
          name="group1"
          value="option2"
          selectedValue={selectedOption}
          onChange={setSelectedOption}
        />
        <SharedRadioButton
          label="Disabled (Unselected)"
          name="group2"
          value="disabled1"
          selectedValue=""
          disabled
        />
        <SharedRadioButton
          label="Disabled (Selected)"
          name="group3"
          value="disabled2"
          selectedValue="disabled2"
          disabled
        />

        <hr />

        <SharedRadioGroup
          name="gender"
          selectedValue={selectedGender}
          onChange={setSelectedGender}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other", disabled: true },
          ]}
        />
      </div>

      <hr />

      {/* Variation Radios Section */}
      <div style={{ padding: "0 10px" }}>
        <h4>VariationRadio #1 - Payment Methods</h4>
        <VariationRadio
          data={[
            {
              colClass: "col-md-6",
              title: "Select your payment method",
              child: [
                {
                  id: 1,
                  labelText: "BOB",
                  image: "ecommerce/card.png",
                  name: "radio1",
                },
                {
                  id: 2,
                  labelText: "MasterCard",
                  image: "ecommerce/mastercard.png",
                  name: "radio1",
                  defaultChecked: true,
                },
                {
                  id: 3,
                  labelText: "Paypal",
                  image: "ecommerce/paypal.png",
                  name: "radio1",
                },
                {
                  id: 4,
                  labelText: "VISA",
                  image: "ecommerce/visa.png",
                  name: "radio1",
                },
              ],
            },
          ]}
        />

        <h4>VariationRadio #2 - Web Design Topics</h4>
        <VariationRadio
          data={[
            {
              colClass: "col-md-6",
              title:
                "What are the most important things to learn about web design?",
              child: [
                { id: 5, labelText: "A. HTML", name: "radio2" },
                { id: 6, labelText: "B. CSS", name: "radio2" },
                {
                  id: 7,
                  labelText: "C. Javascript",
                  name: "radio2",
                  defaultChecked: true,
                },
                { id: 8, labelText: "D. Above the all", name: "radio2" },
              ],
            },
          ]}
        />

        <h4>VariationRadio #3 - Creative Icons</h4>
        <VariationRadio
          data={[
            {
              title: "Radios With Creative Options & SVG Icons",
              child: [
                {
                  id: 9,
                  labelText: "The notification icon displayed new messages.",
                  icon: "notification",
                  iconColor: "danger",
                  name: "radio3",
                },
                {
                  id: 10,
                  labelText: "The download icon indicated completion.",
                  icon: "stroke-calendar",
                  iconColor: "success",
                  name: "radio3",
                },
                {
                  id: 11,
                  labelText: "The tag icon allowed easy categorization.",
                  icon: "tag",
                  iconColor: "stroke-dark",
                  name: "radio3",
                  defaultChecked: true,
                },
                {
                  id: 12,
                  labelText: "The email icon was inaccessibly located.",
                  icon: "stroke-email",
                  iconColor: "primary",
                  name: "radio3",
                },
              ],
            },
          ]}
        />
      </div>

      <hr />

      {/* Switches Section */}
      <div style={{ padding: "0 10px" }}>
        <h4>SharedSwitch Test Cases</h4>

        <SharedSwitch
          label="Unchecked"
          checked={darkMode}
          onChange={setDarkMode}
        />
        <SharedSwitch
          label="Checked"
          checked={notifications}
          onChange={setNotifications}
        />
        <SharedSwitch label="Disabled (Unchecked)" checked={false} disabled />
        <SharedSwitch label="Disabled (Checked)" checked disabled />
      </div>
    </div>
  );
};

export default SamplePage;
