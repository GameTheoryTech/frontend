//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createTheme } from '@mui/material/styles';
import { relative } from 'path';

const newTheme = createTheme({
  breakpoints: {
    values : {
      xs: 0,
      sm: 767,
      md: 900,
      lg: 1200,
      xl: 1536,
    }
  },
  palette: {
    type: 'dark',
    text: {
      primary: '#fff',
    },
    primary: {
      main: '#FF20DF',
    },
    secondary: {
      main: '#2FF0DD',
    },
    neutral: {
      main: '#EEEB78',
    },
    background: {
      default: 'transparent',
      paper: 'transparent',
    },
  },
  typography: {
    color: '#fff',
    fontFamily: ['"forma-djr-micro"', 'sans-serif'].join(','),
    fontWeight: '500',
    fontSize: 16,
    h1 : {
      fontFamily: ['"kallisto"', 'sans-serif'].join(','),
      fontSize: '50px',
      fontWeight: '500',
      '@media (max-width: 900px)': {
        fontSize: '40px',
      }
    },
    h2 : {
      fontFamily: ['"kallisto"', 'sans-serif'].join(','),
      fontSize: '40px',
      fontWeight: '500',
      '@media (max-width: 900px)': {
        fontSize: '30px',
      }
    },
    h3 : {
      fontSize: '30px',
      fontWeight: '700',
      '@media (max-width: 900px)': {
        fontSize: '24px',
      }
    },
    h4 : {
      fontSize: '24px',
      fontWeight: '700',
      '@media (max-width: 900px)': {
        fontSize: '20px',
      }
    },
    h5 : {
      fontSize: '20px',
      fontWeight: '700',
      '@media (max-width: 900px)': {
        fontSize: '18px',
      }
    },
    h6  : {
      fontSize: '16px',
      fontWeight: '700',
    },
    body1 : {
      fontSize: '14px',
      fontWeight: '500',
    },
    body2 : {
      fontSize: '16px',
      fontWeight: '500',
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: '0px',
          paddingRight: '0px',
          '@media (min-width: 767px)': {
            paddingLeft: '0px',
            paddingRight: '0px',
          }
        }
      }
    },
      MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
                borderRadius: "20px",
                fontWeight: "700",
                padding: "10px 30px",
                boxShadow: "0px 0px 20px 0px var(--accent)",
                textShadow: "0px 0px 20px #FFFFFF",
                '&.Mui-disabled': {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.25)",
                  textShadow: "none"
                }
            },
            outlined: {
              boxShadow: 'none',
              textShadow: "none",
              border: "2px solid var(--accent)",
              color: "#fff",
              transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
              '&:hover': {
                border: "2px solid var(--accent)",
                boxShadow: "0px 0px 20px 0px var(--accent)",
                textShadow: "0px 0px 20px #FFFFFF",
              }
            }
          }
      },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
          boxShadow: "0px 0px 5px var(--extra-color-1)",
          border: "2px solid var(--extra-color-1)",
          backdropFilter: "blur(15px)",
          height: "100%",
          overflow: "initial"
        },
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          textAlign: "center",
          padding: '30px 20px',
          '&:last-child': {
            paddingBottom: '30px',
          },
          '& img': {
            margin: '0 auto',
          }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-expanded': {
            '&:before': {
              opacity: '1',
            }
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(45deg)',
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '10px 40px 16px 16px',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '10px',
          borderBottom: 'none',
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          position: 'relative'
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          '@media (min-width: 767px)': {
            '& .MuiGrid-grid-md-4': {
              flexBasis: '375px',
              maxWidth: '375px',
            },
            '& .MuiGrid-grid-md-6': {
              flexBasis: '500px',
              maxWidth: '500px',
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#0A142A',
          fontSize: '20px',
          borderRadius: '20px',
          '& .MuiSelect-select': {
            padding: '0 20px',
            height: '56px',
            lineHeight: '56px',
          },
          '& .MuiSelect-icon': {
            color: 'var(--accent)',
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--accent)',
              borderWidth: '2px'
            }
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              boxShadow: '0px 0px 20px 0px var(--accent)',
            }
          },
        }
      }
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: '15px',
          '& .MuiSlider-track': {
            boxShadow: '0 0 20px',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#0A142A',
          },
          '& .MuiSlider-thumb': {
            height: '50px',
            width: '50px',
            boxShadow: '0 0 20px',
          },
          '& .MuiSlider-valueLabel': {
            backgroundColor: 'var(--accent)',
            display: 'block',
            transform: 'none!important',
            lineHeight: '1',
            position: 'relative',
            padding: 0,
            top: 0,
            fontSize: '20px',
            fontWeight: '700'
          }
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          backgroundColor: 'transparent',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'var(--accent)',
            textShadow: '0px 0px 20px var(--accent)'
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent',
            color: 'var(--accent)',
            textShadow: '0px 0px 20px var(--accent)',
            '&:hover': {
              backgroundColor: 'transparent',
              color: 'var(--accent)',
              textShadow: '0px 0px 20px var(--accent)'
            }
          },
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          backgroundColor: '#0A142A',
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '18px',
          fontFamily: '"kallisto", sans-serif'
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          '&[data-testid="QuestionMarkIcon"]': {
            fontSize: '20px',
          }
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: 'var(--extra-color-1)',
          fontSize: '16px',
          marginBottom: '10px',
          overflow: 'initial',
        }
      }
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,16,28,0.8)',
          backdropFilter: 'blur(5px)'
        }
      }
    }
  }
});

export default newTheme;
