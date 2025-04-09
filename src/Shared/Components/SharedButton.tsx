'use client';
import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'reactstrap';

type SharedButtonProps = {
  title?: string;
  color?: string;
  size?: 'sm' | 'lg' | 'md' | '';
  outline?: boolean;
  disabled?: boolean;
  active?: boolean;
  className?: string;
  id?: string;
  tooltip?: string;
  onClick?: () => void;
  logo?: string;
};

const SharedButton: React.FC<SharedButtonProps> = ({
  title,
  color = 'primary',
  size = '',
  outline = false,
  disabled = false,
  active = false,
  className = '',
  id,
  onClick,
  tooltip,
  logo,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTargetId, setTooltipTargetId] = useState<string>('');
  const [hover, setHover] = useState(false); // <-- NEW

  useEffect(() => {
    const generatedId = id || `btn-${Math.random().toString(36).substring(2, 9)}`;
    setTooltipTargetId(generatedId);
  }, [id]);

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <Button
        id={tooltipTargetId}
        color={color}
        size={size}
        outline={outline}
        disabled={disabled}
        active={active}
        onClick={onClick}
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)} 
        className={`${className} d-flex align-items-center justify-content-center`}
        style={{
          padding: logo ? '6px 10px' : undefined,
          minWidth: logo ? '40px' : undefined,
          height: logo ? '40px' : undefined,
          filter: hover ? 'brightness(80%)' : undefined, 
          transition: 'filter 0.2s ease', 
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt="logo"
            style={{
              width: '20px',
              height: '20px',
              objectFit: 'contain',
            }}
          />
        ) : (
          title
        )}
      </Button>

      {tooltip && tooltipTargetId && (
        <Tooltip
          placement="top"
          isOpen={tooltipOpen}
          target={tooltipTargetId}
          toggle={toggleTooltip}
        >
          {tooltip}
        </Tooltip>
      )}
    </>
  );
};

export default SharedButton;
