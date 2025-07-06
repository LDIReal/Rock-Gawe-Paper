let handPose;
let video;
let hands = [];

let m_tip = 12

let m_mcp = 9

let r_tip = 16

let r_mcp = 13

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handPose.detectStart(video, gotHands);
}

function WherePart(who, hand){
  return [hands[who].keypoints[hand].x, hands[who].keypoints[hand].y]
}

function pandan(PartList){
  
  Flip_M = false
  Flip_R = false
  
  text("M_U", PartList[0][0], PartList[0][1])
  
  text("M_L", PartList[1][0], PartList[1][1])
  
  text("R_U", PartList[2][0], PartList[2][1])
  
  text("R_L", PartList[3][0], PartList[3][1])
  
  if (PartList[0][1] > PartList[1][1])
    {
      Flip_M = true
    } else
      {
        Flip_M = false
      }
  
  if (PartList[2][1] > PartList[3][1])
    {
      Flip_R = true
    } else
      {
        Flip_R = false
      }
  
  Flip_What = [Flip_M, Flip_R]
  
  return Flip_What
}

function pandanWhatGRP(Flip_What){
  Flip_M = Flip_What[0]
  Flip_R = Flip_What[1]
  
  if (Flip_M == false && Flip_R == false)
    {
      return "Paper"
    } else if (Flip_M == true && Flip_R == true)
      {
        return "Rock"
      } else if (Flip_M == true || Flip_R == true)
        {
          return "Gawe"
        }
}

function pandanWhoWin(PlayerSet){
  OnePlayerSet = PlayerSet[0][1]
  TwoPlayerSet = PlayerSet[1][1]
  
  if (OnePlayerSet == "Gawe" && TwoPlayerSet == "Paper")
    {
      return 0
    } else if (OnePlayerSet == "Gawe" && TwoPlayerSet == "Rock")
      {
        return 1
      } else if (OnePlayerSet == "Paper" && TwoPlayerSet == "Rock")
        {
          return 0
        } else if (OnePlayerSet == "Paper" && TwoPlayerSet == "Gawe")
          {
            return 1
          } else if (OnePlayerSet == "Rock" && TwoPlayerSet == "Gawe")
            {
              return 0
            } else if (OnePlayerSet == "Rock" && TwoPlayerSet == "Paper")
              {
                return 1
              } else
                {
                  return "tie"
                }
}

let gameState = "waiting"
let WinPlayer = ""

function draw() {
  image(video, 0, 0, width, height)
  textSize(24)
  fill(0)

  if (hands.length >= 2 && gameState === "waiting") {
    PlayerSet = []

    for (let i = 0; i < hands.length; i++) {
      text(i, hands[i].keypoints[0].x, hands[i].keypoints[0].y)

      pos_m_tip = WherePart(i, m_tip)
      
      pos_m_mcp = WherePart(i, m_mcp)
      
      pos_r_tip = WherePart(i, r_tip)
      
      pos_r_mcp = WherePart(i, r_mcp)

      PartList = [pos_m_tip, pos_m_mcp, pos_r_tip, pos_r_mcp]
      
      Flip_What = pandan(PartList)
      
      PlayerRGP = pandanWhatGRP(Flip_What)

      PlayerSet.push([i, PlayerRGP])
    }

    WinPlayer = pandanWhoWin(PlayerSet)
    gameState = "pandaned"
  }

  if (gameState == "pandaned") {
    text("결과: " + WinPlayer, 320, 240)
  }

  if (hands.length == 0 && gameState == "pandaned") {
    gameState = "waiting"
    WinPlayer = ""
  }

  if (hands.length < 2 && gameState == "waiting") {
    text("플레이어를 기다리는 중", 320, 240)
  }
}

function gotHands(results) {
  hands = results;
}