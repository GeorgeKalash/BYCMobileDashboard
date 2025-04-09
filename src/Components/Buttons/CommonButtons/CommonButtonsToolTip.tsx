import { CommonButtonToolTip } from '@/Types/ButtonType';
import { useState } from 'react'
import { Tooltip } from 'reactstrap';

const CommonButtonsToolTip:React.FC<CommonButtonToolTip> = ({ id, toolTipText }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <Tooltip isOpen={tooltipOpen} target={id} toggle={toggle}>{toolTipText}</Tooltip>
  )
}

export default CommonButtonsToolTip