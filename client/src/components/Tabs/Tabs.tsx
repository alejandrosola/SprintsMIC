import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { SxProps } from "@mui/material";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

type TabData = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabData[];
  numberTab?: number;
  sx?: SxProps;
  onTabChange?: any;
  selected?: number;
};

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const GenericTabs: React.FC<TabsProps> = ({
  tabs,
  sx,
  onTabChange,
  selected,
}) => {
  selected = selected ? selected : 0;
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (onTabChange) {
      onTabChange(newValue);
      selected = newValue;
    }
  };

  return (
    <div>
      <Tabs
        value={selected}
        onChange={handleChange}
        aria-label="Tabs"
        sx={sx}
        centered
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} sx={sx} />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={selected!} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
};

export default GenericTabs;
